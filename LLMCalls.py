import base64
from google import genai
from google.genai import types
import dotenv
import datetime as dt
import os

dotenv.load_dotenv()
class LLMCalls:
    def __init__(self):
        self.client = genai.Client(
            vertexai=False,
            project="",
            location="",
        )


    def query_resolver(self,query):
        files=[]
        files.append(self.client.files.upload(file="conversation.txt"))

        self.client.files.upload(file="conversation.txt")
        prompt = f"""
The current date is {dt.datetime.now().strftime('%Y-%m-%d')}.
You are an agent that has to describe which pages to get data from depending on the user query. The following are the 4 types of pages available:
Type 1: Player stats: This includes complete details for a player such as team played for, matches, goals, assists etc for each competition. It also includes shooting stats, passing stats, posession, playing time, etc.
Type 2: Team overall: This includes results for any competitions the team played in. This only has competition wise wins/losses count and final position for the team. It has no other data.
Type 3: Team season: This includes details for a team for a specific season. This has further details like stats per player, all fixtures and results of the season. It also includes goalkeeping, shooting, passing, possession, defensive, and playing time stats.
Type 4: Competition season: This includes details for a competition for a specific season. This includes the league table, stats per team, as well as various leaderboards (including but not limited to most goals, most assists, most shots, most fouls etc)

Give the output in the format of a dictionary as follows:
{{"Players":["Player1", "Player2", "Player3"],"Team_overall":["Team1", "Team2", "Team3"],"Team_season":["Team1 season", "Team2 season", "Team3 season"],"Competition_season":["Competition1 season", "Competition2 season", "Competition3 season"]}}
It is up to you to decide which pages need to be accessed. Try to minimize the total number of pages needed to be accessed since this increases the computation time. However make sure that the pages do answer the query.
Here are some examples for you:
Query: "How many goals have Messi and ronaldo scored in their careers?"
Output: {{"Players":["Lionel Messi", "Cristiano Ronaldo"],"Team_overall":[],"Team_season":[],"Competition_season":[]}}
Reason: the data is only available in the player stats page. 

Query "How many goals has Real Madrid scored in La Liga 2024-25?"
Output: {{"Players": [],"Team_overall": ["Real Madrid"],"Team_season": [],"Competition_season": []}}
Reason: the data is available in the team overall page. 

Query: "did madrid perform better with or without Mbappe?"
Output: {{"Players": ["Kylian Mbappe"],"Team_overall": ["Real Madrid"],"Team_season": [],"Competition_season": []}}
Reason: You need to know which seasons mbappe played for madrid from the players page. then you need the team overall page for madrid's performance.


Query: "Against which team did barcelona win the most matches in the last 4 UCL seasons?"
Output: {{"Players":[],"Team_overall":[],"Team_season":["Barcelona 2021-22", "Barcelona 2022-23", "Barcelona 2023-24", "Barcelona 2024-25"],"Competition_season":[]}}
Reason: Matchwise data is available in the season wise pages, so you need all 4 season pages for barcelona.
The current conversation history till now has also been provided in conversation.txt. Decide accordingly if any specific pages are required with specific focus on the latest user query.
Give the reasoning first, and end your answer with the dictionary.
The query you need to respond to is: {query}
"""
        model = "gemini-2.5-flash-preview-04-17"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_uri(
                        file_uri=files[0].uri,
                        mime_type=files[0].mime_type,
                        ) ,
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )


        output=self.client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        ).text
        # print(output)
        
        return eval('{"'+output.split('{"')[1].split(']}')[0]+']}')

    def generate_output(self, query):
        prompt = f"""
The current date is {dt.datetime.now().strftime('%Y-%m-%d')}.
You are an football analyst that has to answer the user query based on the data available in the files.
The conversation history till now has also been provided in conversation.txt.
Do not reveal any information about your data source/website.
Do not use phrases such as "Based on the data I have" or "Based on the given information" or "Looking at the available statistics". The end user should not know that you are looking at the given webpage.
Give detailed answers whenever possible/required.
The user query is: {query}
"""
        output_dir = "outputs"
        model = "gemini-2.5-flash-preview-04-17"
        files = []
        for filename in os.listdir(output_dir):
            file_path = os.path.join(output_dir, filename)
            if os.path.isfile(file_path):
                files.append(self.client.files.upload(file=file_path))
        files.append(self.client.files.upload(file="conversation.txt"))
        contents = [
            types.Content(
                role="user",
                parts=[
                    *[
                        types.Part.from_uri(
                            file_uri=f.uri,
                            mime_type=f.mime_type,
                        ) for f in files
                    ],
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            response_mime_type="text/plain",
        )
        output=self.client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        ).text
        return output
    
    def summaries_required(self, query, current_summaries):
        prompt = f"""
The current date is {dt.datetime.now().strftime('%Y-%m-%d')}.
You have these files available with you. You need to answer this query:{query}. 
Summary of a match is defined as textual details about the events of the match, and not simply its scoreline.
If you require more detailed information regarding the matches such as its summary or for more detailed reviews, you can request it by outputting a list in the following format:
Here by summary we want a detailed analysis of the whole match and what all factors contributed to them as well which cannot be inferred from stats.
['team1 vs team2 dd mmm, yyyy', 'team1 vs team3 dd mmm, yyyy']
The current conversation history till now has also been provided in conversation.txt. Decide accordingly if any specific match summaries are required.
The summaries that are currently available are: {current_summaries}
You can ask for summaries of matches that are not in the above list.
Never give more than 10 summaries at a time.
If no extra information is required, output an empty list.
give reasoning and then the list.
"""
        output_dir = "outputs"
        model = "gemini-2.5-flash-preview-04-17"
        files = []
        for filename in os.listdir(output_dir):
            file_path = os.path.join(output_dir, filename)
            if os.path.isfile(file_path):
                files.append(self.client.files.upload(file=file_path))
        files.append(self.client.files.upload(file="conversation.txt"))
        contents = [
            types.Content(
                role="user",
                parts=[
                    *[
                        types.Part.from_uri(
                            file_uri=f.uri,
                            mime_type=f.mime_type,
                        ) for f in files
                    ],
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            response_mime_type="text/plain",
        )
        output=self.client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        ).text
        return eval("["+output.split("[")[1].split("]")[0]+"]")



if __name__ == "__main__":
    llm = LLMCalls()
    source=llm.summaries_required("give summaries of real madrid's matches against barca")
    print(source)
    print(type(source))
