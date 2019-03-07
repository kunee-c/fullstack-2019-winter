/**
 * Created by kunee on 04/03/2019.
 */
import React, { Component } from 'react';
import CastItem from './CastItem.js'
import { Collapse, Button} from 'reactstrap';
import { ListGroup } from 'reactstrap';

class MovieDetail extends Component {

    constructor() {
        super();

        this.state = {
                collapse: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }


    componentDidUpdate(prevProps, prevState) {

        if(prevProps.id !== this.props.id)
            this.props.getMovieDetail(this.props.id);

    }

    componentDidMount() {
        this.props.getMovieDetail(this.props.id);
    }

    componentWillUnmount() {
        this.props.cleanMovie();
    }


    render() {
        return(
            <div className="mt-3">
            <figure className="figure">
                <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-2">
                    <img className="figure-img float-left img-fluid" src={this.props.movie.imgBaseUrlMovie + this.props.movie.imgUrl}/>
                </div>
                <div className="col-sm-12 col-md-9 col-lg-10">
                <figcaption className="figure-caption">
                    <h3>{this.props.movie.title}</h3>
                    <p>{this.props.movie.description}</p>
                    {
                        <p>Genres: {this.props.movie.genres.map(genre => <span key={genre.id}>{genre.name} </span>)}</p>
                    }
                    {this.props.movie.tagline && <p>Tagline: {this.props.movie.tagline}</p>}
                    <p>Runtime: {this.props.movie.runtime} mn</p>
                    <p>Release date: {this.props.movie.releasedDate}</p>
                    <br/>
                </figcaption>
                </div>

                </div>
            </figure>
            <div>
                <button type="button" className="btn btn-outline-dark"  onClick={this.toggle} >Cast</button>
                <Collapse isOpen={this.state.collapse}>

                    <ListGroup flush>
                        {this.props.movie.cast.map(cast =><CastItem getMoviesByCast={this.props.getMoviesByCast} key={cast.id} urlImgBase={this.props.movie.imgBaseUrlCast} cast={cast}/>)}
                    </ListGroup>
                </Collapse>
            </div>

            </div>
        );
    }

}

export default MovieDetail;