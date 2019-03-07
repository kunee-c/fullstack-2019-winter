import React, { Component } from 'react';
import './App.css';
import MoviesList from './components/MoviesList.js';
import MovieDetail from './components/MovieDetail.js';

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class App extends Component {

  constructor() {
    super();
    this.apiKey= '7bf47e2b6bb5fcf163cad9385851f099';
    this.apiBaseUrl= 'https://api.tmdb.org/3/';
    this.movieDetail = {
      title: '',
      tagline: '',
      imgUrl: '',
      genres: [],
      runtime: '',
      description: '',
      cast: [],
      imgBaseUrlMovie: '',
      imgBaseUrlCast: ''
    };

    this.state = {
      movies: [],
      moviesPerPage: [],
      totalPages: 0,
      currentPage: 1,
      conf: {},
      movie: this.movieDetail
    }

    this.getMoviesByPage = this.getMoviesByPage.bind(this);
    this.getMovieDetail = this.getMovieDetail.bind(this);
    this.getMoviesByCast = this.getMoviesByCast.bind(this);
    this.cleanMovie = this.cleanMovie.bind((this));
  }

  async componentDidMount(){

    let page = 1;

    const confRes = await fetch(this.getConfigUrl());
    const conf = await confRes.json();

    this.setState({conf: conf});

    const movies = [];
    const MoviesRes = await fetch(this.getTheMovieDbUrl(page));
    const moviesData = await MoviesRes.json();

    for(let i=1; i<= moviesData.total_pages; i++) {

      const list = await this.loadMoviesList(i);
      movies.push(...list.filter(item => item.popularity >= 10));
      this.setState({movies: movies});
    }

    this.state.movies.length > 19 ? this.setState({totalPages: this.state.movies.length/20}) : this.setState({totalPages: 1});
    this.setState({currentPage: 1});
    this.getMoviesByPage(1);
  }

  async loadMoviesList(page) {

    const MoviesRes = await fetch(this.getTheMovieDbUrl(page));
    const data = await MoviesRes.json();

    return data.results.map(movie => {

      let imgUrl = "";

      if(movie.poster_path)
       imgUrl = this.state.conf.images.secure_base_url + this.state.conf.images.poster_sizes[0] + movie.poster_path;
      else
        imgUrl = '/movie.svg';

      return {
        id: movie.id,
        title: movie.title,
        imgUrl: imgUrl,
        popularity: movie.popularity,
        releaseDate: movie.release_date
      }

    });
  }


  getTheMovieDbUrl(page) {
    return `${this.apiBaseUrl}discover/movie?api_key=${this.apiKey}&sort_by=primary_release_date.asc&include_adult=false&include_video=false&page=${page}&primary_release_year=2019`;
  }

  getConfigUrl() {
    return `${this.apiBaseUrl}configuration?api_key=${this.apiKey}`;
  }


  getMoviesByPage(page) {
    let nbMoviesPerPage = 20;
    let movies = [];

    let lastIndex = nbMoviesPerPage*page;
    let fistIndex = lastIndex-nbMoviesPerPage;
    this.setState({currentPage: page});
    this.setState({moviesPerPage: this.state.movies.slice(fistIndex,lastIndex)});
  }

  getMovieDetailUrl(movieIf) {
    return `${this.apiBaseUrl}movie/${movieIf}?api_key=${this.apiKey}`;
  }

  getCreditUrl(movie) {
    return `${this.apiBaseUrl}movie/${movie}/credits?api_key=${this.apiKey}`;
  }

  getTheMoviesByCastUrl(personId) {
    return `${this.apiBaseUrl}discover/movie?api_key=${this.apiKey}&sort_by=primary_release_date.asc&include_adult=false&include_video=false&with_cast=${personId}`;
  }

  getMoviesByCast(personId) {
    return fetch(this.getTheMoviesByCastUrl(personId)).then(data => data.json());
  }

  cleanMovie(){
    this.movieDetail = {
      title: '',
      tagline: '',
      imgUrl: '',
      genres: [],
      runtime: '',
      description: '',
      cast: [],
      imgBaseUrlMovie: '',
      imgBaseUrlCast: ''
    };
    this.setState({movie:this.movieDetail});
  }
  getMovieDetail(movieId) {

    fetch(this.getMovieDetailUrl(movieId)).then(data => data.json()).then( movie => {

      this.movieDetail.title= movie.title;
      this.movieDetail.tagline= movie.tagline;
      this.movieDetail.genres= movie.genres;
      this.movieDetail.runtime= movie.runtime;
      this.movieDetail.description= movie.overview;
      this.movieDetail.imgUrl= movie.poster_path;
      this.movieDetail.releasedDate= movie.release_date;


      return fetch(this.getCreditUrl(movieId))

    }).then(data => data.json()).then( credit => {

      this.movieDetail.cast= credit.cast;
      
      return fetch(this.getConfigUrl());

    }).then(data => data.json()).then( conf => {
      this.movieDetail.imgBaseUrlMovie = conf.images.base_url + conf.images.poster_sizes[2];
      this.movieDetail.imgBaseUrlCast = conf.images.base_url + conf.images.poster_sizes[0];

      this.setState({movie: this.movieDetail});
    });
  }

  render() {
    return (
      <div className="container">

        <Router>
          <div>
            <header className="sticky-top">
              <nav className="navbar navbar-light bg-light">
                <Link className="navbar-brand" to="/">
                  <img id="logoTiff" src="/logo-black.png" width="50px" className="d-inline-block align-top" alt=""/>
                </Link>
                <span >Top movies released in 2019</span>
              </nav>
            </header>
            <Switch>
              <Route exact path="/" render={(props) => (
                <MoviesList movies={this.state.moviesPerPage} nbPages={this.state.totalPages} currentPage={this.state.currentPage} loadMovies={this.getMoviesByPage}/>
              )}/>
              <Route path="/detail/:id" render={(props) => {
                let id = props.location.pathname.replace('/detail/','');
                return(<MovieDetail cleanMovie={this.cleanMovie} getMoviesByCast={this.getMoviesByCast} getMovieDetail={this.getMovieDetail} movie={this.state.movie} conf={this.state.conf} apiKey={this.apiKey} apiUrl={this.apiBaseUrl} id={id}/>);
              }}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
