import { useEffect, useRef, useState } from "react";
import StarRating from "./star";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

const average = (arr) =>
  arr.reduce((acc, cur, arr) => acc + cur / arr.length, 0);

const KEY = "5f78c4a5";

export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");
  const { movies, isOpen, error } = useMovies(query, CloseMovie);

  function SelectedMovie(id) {
    return setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function CloseMovie() {
    return setSelectedId(null);
  }
  function handelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <Text />
      </NavBar>

      <Main>
        <Box>
          {isOpen && <Loading />}
          {!isOpen && !error && (
            <List1 movies={movies} onSelected={SelectedMovie} />
          )}
          {error && <HandelError message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={CloseMovie}
              onAddWatch={handelAddWatched}
              watched={watched}
            />
          ) : (
            <>
              {" "}
              <Summary watched={watched} />
              <List2 watched={watched} onDeleteWatched={handelDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loading() {
  return <p className="loader"> Loading... </p>;
}
function HandelError({ message }) {
  return (
    <p className="error">
      <span> ⛔ </span>
      {message}
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && <>{children}</>}
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(function () {
    inputEl.current.focus();
  }, []);


  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Text() {
  return (
    <p className="num-results">
      Found <strong> x </strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function List1({ movies, onSelected }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <LiList1 key={movie.imdbID} movie={movie} onSelected={onSelected} />
        ))}
      </ul>
    </>
  );
}
function LiList1({ movie, onSelected }) {
  return (
    <>
      <li onClick={() => onSelected(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}

function Button({ setIsOpen, isOpen }) {
  return (
    <>
      {" "}
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatch, watched }) {
  const [movie, setMove] = useState({});
  const [mov, setMov] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watched.map((move) => move.imdbID).includes(selectedId);
  const userRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handelAdd() {
    const newWhatChdMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      mov,
      countRating: countRef.current,
    };
    onAddWatch(newWhatChdMovie);
    onCloseMovie();
  }
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMove(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie  ${title}`;
      return function () {
        document.title = "usePopcorn ";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} ImDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} onsetMove={setMov} />
                  {mov > 0 && (
                    <button className="btn-add" onClick={handelAdd}>
                      ADD to list
                    </button>
                  )}{" "}
                </>
              ) : (
                <p>
                  {" "}
                  your rated with movie {userRating} <span>🌟</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
          {selectedId}{" "}
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating.toFixed(2)}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating.toFixed(2)}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}
function LiList2({ movie, onDeleteWatched }) {
  return (
    <>
      <li onClick={() => onDeleteWatched(movie.imdbID)}>
        <img src={movie.poster} alt={`${movie.Title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
    </>
  );
}
function List2({ watched, onDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <LiList2
            movie={movie}
            key={movie.imdbID}
            onDeleteWatched={onDeleteWatched}
          />
        ))}
      </ul>
    </>
  );
}
