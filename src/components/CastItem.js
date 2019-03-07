/**
 * Created by kunee on 06/03/2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap';


class CastItem extends Component {

    constructor() {
        super();

        this.state = {
            movies: []
        };
    }

    componentDidMount() {

        this.props.getMoviesByCast(this.props.cast.id).then(movies => {
            this.setState({movies: movies.results});
        });
    }



    render() {

        return(
        <ListGroupItem key={this.props.cast.id} tag="a" >
            <figure className="figure">
                <img className="figure-img img-fluid rounded" src={this.props.urlImgBase + this.props.cast.profile_path}/>

                <figcaption className="figure-caption text-right">
                    Name: {this.props.cast.name}, Character: {this.props.cast.character}
                </figcaption>
            </figure>
            <div className="mt-2">
                <ul className="list-inline">
                    {this.state.movies.map(movie => <li className="list-inline-item" key={movie.id}><Link to={`${movie.id}`} >{movie.title}</Link></li>)}
                </ul>
            </div>
        </ListGroupItem>

        );
    }
}

export default CastItem;