import asyncio
from search import GoogleSearchEngine
from LLMCalls import LLMCalls
from scraper import crawler
from espn_scraper import self_scraper
import dotenv
import os

dotenv.load_dotenv()

output_folder = "outputs"
for filename in os.listdir(output_folder):
    file_path = os.path.join(output_folder, filename)   
    os.remove(file_path)
os.remove("conversation.txt") if os.path.exists("conversation.txt") else None
visited_links = []
i=1
current_summaries = []
query=''
while query!="bye":
    f=open("conversation.txt","a")
    query=input("Enter your query: ")
    if query=="bye":
        f.close()
        break
    f.write(f"User query {i}: {query}\n")
    llm=LLMCalls()
    searches_dict=llm.query_resolver(query)

    searches=[]
    for player in searches_dict['Players']:
        searches.append(player+" all competitions site:fbref.com/en/players")
    for team in searches_dict['Team_overall']:
        searches.append(team+" stats and history site:fbref.com/en/squads")
    for team in searches_dict['Team_season']:
        searches.append(team+" site:fbref.com/en/squads")
    for competition in searches_dict['Competition_season']:
        searches.append(competition+" site:fbref.com/en/comps")
    GSEARCH_API_KEY=os.getenv("GSEARCH_API_KEY")
    CSE_ID=os.getenv("CSE_ID")
    search_engine = GoogleSearchEngine(api_key=GSEARCH_API_KEY, cse_id=CSE_ID)
    links = []
    for search in searches:
        links.append(search_engine.search(search, num_results=1)[0])
    temp_links=[]
    for link in links: 
        if "en/players" in link:
            parts = link.split("/") 
            temp_links.append(f"https://fbref.com/en/players/{parts[5]}/all_comps/{parts[6]}-Stats---All-Competitions")
            temp_links.append(f"https://fbref.com/en/players/{parts[5]}/nat_tm/{parts[6]}-National-Team-Stats")
        else:
            temp_links.append(link)
    links=[]
    for link in temp_links:
        if link not in visited_links:
            visited_links.append(link)
            links.append(link)


    async def run_crawlers(links):
        tasks = [crawler(link) for link in links]
        await asyncio.gather(*tasks)


    asyncio.run(run_crawlers(links))
    
    match_summaries=[match+" site:espn.in" for match in llm.summaries_required(query,current_summaries)]
    print(match_summaries)
    current_summaries.extend(match_summaries)
    summary_links=[]
    for match in match_summaries:
        link=search_engine.search(match, num_results=1)[0]
        if "football/match" in link:
            parts = link.split("/") 
            summary_links.append(f"https://www.espn.in/football/report/_/gameId/{parts[-2]}")
        elif "football/preview" in link:
            parts = link.split("/") 
            summary_links.append(f"https://www.espn.in/football/report/_/gameId/{parts[-1]}")
        else:
            summary_links.append(link)
    print(summary_links)
    self_scraper(summary_links)


    out=llm.generate_output(query)
    f.write(f"LLM output {i}: {out}\n")
    i+=1
    print(out)
    f.close()

