from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

async def crawler(link):
    # 1) Configure the Markdown generator to ignore links
    md_generator = DefaultMarkdownGenerator(
        options={
            "ignore_links": True,     # strip out [text](), leaving just the text
            "escape_html": False,
            "body_width": 80
        }
    )

    # 2) Exclude all <a> tags so no links are included in the DOM at all
    config = CrawlerRunConfig(
        markdown_generator=md_generator,
        excluded_tags=[],
        cache_mode=CacheMode.BYPASS
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(link, config=config)

        if result.success:
            with open(f"outputs/{''.join(link.split("/"))}.txt", "w", encoding='utf-8') as file:
                file.write(result.markdown.raw_markdown)
        else:
            with open(f"outputs/{''.join(link.split("/"))}.txt", "w", encoding='utf-8') as file:
                file.write("Crawl failed: " + result.error_message)

# if __name__ == "__main__":
#     asyncio.run(main())
