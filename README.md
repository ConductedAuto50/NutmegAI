# Nutmeg AI

Nutmeg AI is an intelligent football/soccer assistant built with Flask and modern AI technologies. It provides football statistics, match information, player data, and interactive visualizations through a user-friendly chat interface.

## Features

- 💬 **Conversational Interface**: Ask natural language questions about football
- 🔍 **Intelligent Search**: Automatically searches for relevant information
- 📊 **Data Visualization**: Interactive charts and graphs for statistics
- 🕸️ **Web Scraping**: Retrieves data from trusted sources like fbref.com and ESPN
- 📝 **Match Summaries**: Access detailed information about specific matches
- 🏆 **Comprehensive Coverage**: Players, teams, competitions, and general queries

## Directory Structure

```
Nutmeg AI/
├── main.py              # Main Flask application
├── search.py            # Google search integration
├── LLMCalls.py          # LLM interaction functions
├── scraper.py           # General web scraper
├── espn_scraper.py      # ESPN-specific scraper
├── grapher.py           # Data visualization tools
├── conversation.txt     # Chat history log
├── static/              # Static assets
│   └── facts.txt        # Football facts for display
├── templates/           # HTML templates
│   ├── index.html       # Landing page
│   └── chat.html        # Chat interface
└── outputs/             # Generated outputs directory
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- API keys for Google Search and LLM service

### Windows

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nutmeg-ai.git
   cd "Nutmeg AI"
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Linux/Mac

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nutmeg-ai.git
   cd "Nutmeg AI"
   ```

2. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

1. Create a `.env` file in the root directory:
   ```
   GSEARCH_API_KEY=your_google_search_api_key
   CSE_ID=your_google_custom_search_engine_id
   LLM_API_KEY=your_llm_api_key
   ```

2. Make sure you have the required folders:
   ```
   mkdir -p outputs
   ```

## Usage

### Starting the Server

- **Windows**:
  ```
  venv\Scripts\activate
  python main.py
  ```

- **Linux/Mac**:
  ```
  source venv/bin/activate
  python main.py
  ```

The application will run on `http://127.0.0.1:5000/` by default.

### Interacting with Nutmeg AI

1. Open your web browser and navigate to `http://127.0.0.1:5000/`
2. Click on the "Chat" button or go to `http://127.0.0.1:5000/chat`
3. Enter your football-related query in the chat input
4. The AI will:
   - Analyze your query to determine required information
   - Search for relevant data sources
   - Scrape websites for current statistics and information
   - Generate a response with the requested information
   - Create interactive visualizations when appropriate

### Example Queries

- "Who is the top scorer in the Premier League this season?"
- "Compare Lionel Messi and Cristiano Ronaldo's goal statistics"
- "Show me Manchester United's performance over the last 5 matches"
- "Create a chart of Arsenal's possession stats this season"
- "Who won the Champions League final last year?"

## Workflow

1. **User Input**: The user submits a question through the chat interface
2. **Query Resolution**: The LLM analyzes the query to determine what information is needed
3. **Search Phase**: Google searches are performed for relevant information based on query type:
   - Player statistics (with "site:fbref.com" specification)
   - Team information (current or historical)
   - Competition details
   - Match summaries (from ESPN)
4. **Data Collection**: The system crawls the search results to gather information
5. **Response Generation**: The LLM generates a response based on the collected data
6. **Visualization**: If appropriate, interactive charts are created to visualize the data
7. **Presentation**: The response is displayed to the user in the chat interface

## API Endpoints

- `GET /`: Main landing page
- `GET /chat`: Chat interface
- `GET /graph.png`: Serves generated graph images
- `GET /get_facts`: Returns random football facts
- `POST /chat_api`: Processes chat messages and returns AI responses

## Troubleshooting

### Common Issues

- **API Key Errors**: Ensure your `.env` file contains valid API keys
- **Scraping Failures**: Some websites may change their structure; check that scrapers are up-to-date
- **No Data Found**: Verify that search queries are properly formatted
- **LLM Connection Issues**: Check your internet connection and LLM API key validity

### Server Reset

To clear the server state and start fresh:
- Send "reset_state" as a message in the chat interface

## Dependencies

- Flask: Web framework
- dotenv: Environment variable management
- asyncio/nest_asyncio: Asynchronous operations
- Google Custom Search API: Web search functionality
- LLM API: Natural language processing
- Beautiful Soup (implied): Web scraping

## License

[Add your license information here]

## Acknowledgments

- fbref.com for football statistics data
- ESPN for match summaries and additional information