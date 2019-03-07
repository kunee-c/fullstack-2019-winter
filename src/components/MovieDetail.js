/**
 * Created by kunee on 04/03/2019.
 */
import React, { Component } from 'react';
import CastItem from './CastItem.js'
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { ListGroup } from 'reactstrap';

class MovieDetail extends Component {

    constructor() {
        super();

        this.state = {
                title: '',
                tagline: '',
                imgUrl: '',
                genres: [],
                runtime: '',
                description: '',
                cast: [],
                collapse: false
        }

        this.toggle = this.toggle.bind(this);
        this.getMoviesByCast = this.getMoviesByCast.bind(this);
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.id !== this.props.id)
            this.initState();


    }

    componentDidMount() {
        this.initState();
        this.props.getMovieDetail(this.props.id);

    }

    initState() {
        fetch(this.getMovieDetailUrl(this.props.id)).then(data => data.json()).then( movie => {

            this.setState({title: movie.title});
            this.setState({tagline: movie.tagline});
            this.setState({genres : movie.genres});
            this.setState({runtime : movie.runtime});
            this.setState({description : movie.overview});
            this.setState({imgUrl: movie.poster_path});
            this.setState({releasedDate: movie.release_date});
            return fetch(this.getCreditUrl(this.props.id))

        }).then(data => data.json()).then( credit => {

            this.setState({cast: credit.cast});

            return fetch(this.getConfUrl());
        }).then(data => data.json()).then( conf => {
                this.setState({imgBaseUrlMovie : conf.images.secure_base_url+conf.images.poster_sizes[2]});
                this.setState({imgBaseUrlCast : conf.images.secure_base_url+conf.images.poster_sizes[0]});

            }

        );
    }



    getMovieDetailUrl(movie) {
        return `${this.props.apiUrl}movie/${movie}?api_key=${this.props.apiKey}`;

    }

    getCreditUrl(movie) {
        return `${this.props.apiUrl}movie/${movie}/credits?api_key=${this.props.apiKey}`;
    }

    getConfUrl() {
        return `${this.props.apiUrl}configuration?api_key=${this.props.apiKey}`;
    }

    getTheMoviesByCastUrl(personId) {
        return `${this.props.apiUrl}discover/movie?api_key=${this.props.apiKey}&sort_by=primary_release_date.asc&include_adult=false&include_video=false&with_cast=${personId}`;
    }

    getMoviesByCast(personId) {
        return fetch(this.getTheMoviesByCastUrl(personId)).then(data => data.json());
    }

    render() {
        return(
            <div className="mt-3">
            <figure className="figure">
                <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-2">
                    <img className="figure-img float-left img-fluid" src={this.state.imgBaseUrlMovie + this.state.imgUrl}/>
                </div>
                <div className="col-sm-12 col-md-9 col-lg-10">
                <figcaption className="figure-caption">
                    <h3>{this.state.title}</h3>
                    <p>{this.state.description}</p>
                    <p>Genres: {this.state.genres.map(genre => <span key={genre.id}>{genre.name} </span>)}</p>
                    {this.state.tagline && <p>Tagline: {this.state.tagline}</p>}
                    <p>Runtime: {this.state.runtime} mn</p>
                    <p>Release date: {this.state.releasedDate}</p>
                    <br/>
                </figcaption>
                </div>

                </div>
            </figure>
            <div>
                <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Cast</Button>
                <Collapse isOpen={this.state.collapse}>

                    <ListGroup flush>
                        {this.state.cast.map(cast =><CastItem getMoviesByCast={this.getMoviesByCast} key={cast.id} apiUrl={this.props.apiUrl} apiKey={this.props.apiKey} urlImgBase={this.state.imgBaseUrlCast} cast={cast}/>)}
                    </ListGroup>
                </Collapse>
            </div>

            </div>
        );
    }

}

export default MovieDetail;