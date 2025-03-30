import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import NewsItem from "./NewsItem";

const News = ({ setProgress, apiKey, country, category, pageSize }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const updateNews = async () => {
        if (!apiKey) {
            console.error("API Key is missing! Make sure you have added it to the .env file.");
            return;
        }

        setLoading(true);
        setProgress(10);

        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
        console.log("Fetching news from:", url);

        try {
            let response = await fetch(url);
            let parsedData = await response.json();
            console.log("Fetched Data:", parsedData);

            setArticles(parsedData.articles || []);
            setTotalResults(parsedData.totalResults || 0);
            setProgress(100);
        } catch (error) {
            console.error("Error fetching news:", error);
        }

        setLoading(false);
    };

    useEffect(() => {
        updateNews();
    }, [apiKey, country, category, pageSize]);

    const fetchMoreData = async () => {
        if (!apiKey) return;

        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
        console.log("Fetching more data from:", url);

        try {
            let response = await fetch(url);
            let parsedData = await response.json();
            setArticles((prevArticles) => [...prevArticles, ...(parsedData.articles || [])]);
        } catch (error) {
            console.error("Error fetching more news:", error);
        }

        setPage(page + 1);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>
                NewsMonkey - Top {category.charAt(0).toUpperCase() + category.slice(1)} Headlines
            </h1>

            {loading && <Spinner />}

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.length > 0 &&
                            articles.map((article) => (
                                <div className="col-md-4" key={article.url}>
                                    <NewsItem
                                        title={article.title}
                                        description={article.description}
                                        imageUrl={article.urlToImage}
                                        newsUrl={article.url}
                                        source={article.source?.name || "Unknown"} // ✅ Fix applied here
                                        author={article.author}
                                        date={article.publishedAt}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
};

export default News;
