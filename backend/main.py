import os
import asyncio
import dotenv
from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
from flask_cors import CORS
from search import GoogleSearchEngine
from LLMCalls import LLMCalls
from scraper import crawler 
from espn_scraper import self_scraper
from grapher import create_graph
import nest_asyncio
import json
import time

# Apply nest_asyncio to allow nested event loops (needed for asyncio.run inside Flask)
nest_asyncio.apply()

dotenv.load_dotenv(override=True)

# clear previous outputs and conversation
output_folder = "outputs"
if os.path.exists(output_folder):  # Check if directory exists before listing it
    for filename in os.listdir(output_folder):
        os.remove(os.path.join(output_folder, filename))
if os.path.exists("conversation.txt"): os.remove("conversation.txt")

# global state
visited_links = []
current_summaries = []
i = 1

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)  # Enable CORS for React development

# Serve React app for all routes except API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return "API route not found", 404
    return app.send_static_file('index.html')

# API Routes
@app.route('/api/chat', methods=['POST'])
def chat_api():
    global i, visited_links, current_summaries
    data = request.get_json()
    query = data.get('message', '')
    if query.lower() == 'bye':
        return jsonify(response="Goodbye!")
    
    if query.lower() == 'reset_state':
        visited_links.clear()
        current_summaries.clear()
        return jsonify(response="Server state reset.")
    
    # log user query
    with open("conversation.txt", "a") as f:
        f.write(f"User query {i}: {query}\n")
    
    # resolve searches
    llm = LLMCalls()
    searches_dict = llm.query_resolver(query)
    searches = []
    
    # Add player searches
    if 'Players' in searches_dict:
        for player in searches_dict['Players']:
            searches.append(player + " all competitions site:fbref.com/en/players")
    
    # Add team searches
    if 'Team_overall' in searches_dict:
        for team in searches_dict['Team_overall']:
            searches.append(team + " stats and history site:fbref.com/en/squads")
    
    if 'Team_season' in searches_dict:
        for team in searches_dict['Team_season']:
            searches.append(team + " site:fbref.com/en/squads")
    
    # Add competition searches
    if 'Competition_season' in searches_dict:
        for comp in searches_dict['Competition_season']:
            searches.append(comp + " site:fbref.com/en/comps")
    
    if 'General_query' in searches_dict:
        for genquery in searches_dict['General_query']:
            searches.append(genquery)
    # Perform Google searches if we have search queries
    links = []
    if searches:
        search_engine = GoogleSearchEngine(api_key=os.getenv('GSEARCH_API_KEY'), cse_id=os.getenv('CSE_ID'))
        links = []
        for s in searches:
            search_results = search_engine.search(s, num_results=1)
            if search_results:  # Check if results were returned
                links.append(search_results[0])
        
        # Refine fbref links
        temp_links = []
        for link in links:
            try:
                if "en/players" in link and "fbref.com" in link:
                    parts = link.split("/")
                    if len(parts) > 6:  # Make sure the parts exists before accessing
                        temp_links.append(f"https://fbref.com/en/players/{parts[5]}/all_comps/{parts[6]}-Stats---All-Competitions")
                        temp_links.append(f"https://fbref.com/en/players/{parts[5]}/nat_tm/{parts[6]}-National-Team-Stats")
                else:
                    temp_links.append(link)
            except Exception as e:
                print(f"Error processing link {link}: {e}")
                temp_links.append(link)  # Add the original link as fallback
        
        # Filter visited
        new_links = [l for l in temp_links if l not in visited_links]
        visited_links.extend(new_links)
        
        # Run crawlers
        if new_links:
            run_async(run_crawlers(new_links))
    
    # Fetch match summaries via espn_scraper
    search_engine = None
    summary_links = []
    summaries_required = llm.summaries_required(query, current_summaries)
    if summaries_required:  # Check if it's not None or empty
        match_queries = [m + " site:espn.in" for m in summaries_required]
        print("Matches received: ", match_queries)
        current_summaries.extend(match_queries)
        
        if match_queries:
            if not search_engine:  # Only initialize if not already done
                search_engine = GoogleSearchEngine(api_key=os.getenv('GSEARCH_API_KEY'), cse_id=os.getenv('CSE_ID'))
            
            for mq in match_queries:
                search_results = search_engine.search(mq, num_results=1)
                if search_results:  # Check if results were returned
                    link = search_results[0]
                    try:
                        if "football/match" in link:
                            parts = link.split("/")
                            if len(parts) > 2:  # Make sure there are enough parts
                                summary_links.append(f"https://www.espn.in/football/report/_/gameId/{parts[-2]}")
                        elif "football/preview" in link:
                            parts = link.split("/")
                            if parts:  # Make sure there's at least one part
                                summary_links.append(f"https://www.espn.in/football/report/_/gameId/{parts[-1]}")
                        else:
                            summary_links.append(link)
                    except Exception as e:
                        print(f"Error processing summary link {link}: {e}")
                        summary_links.append(link)  # Add the original link as fallback
            
            if summary_links:
                self_scraper(summary_links)
                print("ESPN scraping completed.")
    
    # Generate response
    if 'Graph_to_be_drawn' in searches_dict and searches_dict['Graph_to_be_drawn'] == [True]:
        try:
            out = llm.generate_graph_content(query=query)
            if "*****" in out:  # Make sure the separator exists
                try:
                    # Extract the parts of the response
                    parts = out.split("*****")
                    
                    # The text is in the first part
                    text_out = parts[0].strip()
                    
                    # The graph data is in the second part if available
                    graph_data = parts[1].strip() if len(parts) > 1 else None
                    
                    # Create the graph
                    if graph_data:
                        try:
                            # graph_json = json.loads(graph_data)
                            # chart_filename = create_graph(graph_json)
                            # chart_url = url_for('serve_chart', filename=chart_filename)
                            # Return both text and chart data
                            return jsonify(response=f"{text_out}\n\n*****\n{graph_data}")
                        except json.JSONDecodeError as e:
                            print(f"Error parsing graph JSON: {e}")
                            return jsonify(response=text_out)
                    else:
                        return jsonify(response=text_out)
                except Exception as e:
                    print(f"Error processing graph response: {e}")
                    return jsonify(response=out)
            else:
                return jsonify(response=out)
        except Exception as e:
            print(f"Error generating graph content: {e}")
            return jsonify(response="Sorry, I encountered an error while generating the graph.")
    else:
        # Regular text response
        response = llm.generate_output(query=query)
        return jsonify(response=response)

@app.route('/charts/<path:filename>')
def serve_chart(filename):
    return send_from_directory('test_results', filename)

# Legacy route for backward compatibility
@app.route('/chat_api', methods=['POST'])
def legacy_chat_api():
    return chat_api()

@app.route('/api/facts')
def get_facts():
    """Route to get football facts from facts.txt"""
    try:
        # Path to facts.txt in the static folder
        facts_path = os.path.join('static', 'facts.txt')
        
        # Read facts from file
        with open(facts_path, 'r', encoding='utf-8') as file:
            facts = [line.strip() for line in file.readlines() if line.strip()]
        
        return jsonify({'facts': facts})
    except Exception as e:
        app.logger.error(f"Error reading facts: {str(e)}")
        return jsonify({'facts': ["Did you know? Football is the most popular sport in the world!"]})

def run_async(coroutine):
    """Helper function to run async code in sync context"""
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coroutine)

async def run_crawlers(links):
    """Run multiple crawlers concurrently"""
    if links:
        await asyncio.gather(*[crawler(l) for l in links])
        print("Crawling completed.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)