import React from "react";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

export default function App() {

  const [articles, setArticles] = React.useState(null);
  const [bookmarks, setBookmarks] = React.useState([]);
  const [showBookmark, setShowBookmark] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    fetch('https://saurav.tech/NewsAPI/top-headlines/category/health/in.json')
      .then(response => response.json())
      .then(data => setArticles(data.articles))
      .catch(error => console.log(error));
  }, []);

  const handleBookmark = (index) => {
    if(!bookmarks.includes(index)){
      const newAddition = [...bookmarks];
      newAddition.push(index);
      setBookmarks(newAddition);
    }
  };

  // Logic for displaying bookmarks
  const bookmarksPerPage = 5;
  const indexOfLastBookmark = currentPage * bookmarksPerPage;
  const indexOfFirstBookmark = indexOfLastBookmark - bookmarksPerPage;
  const currentBookmarks = articles?.slice(indexOfFirstBookmark, indexOfLastBookmark);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(articles?.length/bookmarksPerPage); i++) {
    pageNumbers.push(i);
  }

  function handleClick(event){
    console.log(event.target.id);
    setCurrentPage(event.target.id);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <li
        key={number}
        id={number}
        onClick={handleClick}
      >
        {number}
      </li>
    );
  });

  return (
    <div className="Container">

      {/* header section */}
      <section className = 'header'>
        <h1 className = "heading">News Feed</h1>
        {/* toggle button to switch to bookmark news */}
        <div 
        className="nav-toggle"
        onClick = {() => {setShowBookmark(!showBookmark)}}
        >
          {!showBookmark ? 'Show Bookmark News' : 'Show News'}
        </div>
      </section>

      {/* content area */}
      <section className = 'content'>
        {!showBookmark && articles && currentBookmarks.map((article, index) => (
          // for showing all news
          <div className="news" key={index}>

            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <button onClick={() => handleBookmark(article)}>
              <FontAwesomeIcon icon={faBookmark} />
              &nbsp;Bookmark
            </button>
          </div>
        ))}

        {/* for showing bookmarked news */}
        {showBookmark && bookmarks && bookmarks.map((article, index) => (
          <div className="bookmarked-news" key={index}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url}>Read more</a>
          </div>
        ))}
        {!showBookmark && <ul id="page-numbers">
          {renderPageNumbers}
        </ul>}
      </section>
    </div>
  );
}
