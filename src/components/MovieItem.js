/**
 * Created by kunee on 04/03/2019.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class MovieItem extends  Component {

    constructor() {
        super();
        this.imageUrl = '';
    }

    componentDidMount() {

    }

    render() {
        return (
            <figure className="col figure">
                <img className="figure-img" src={this.props.imgUrl}/>
                <figcaption className="figure-caption">
                    <div>{this.props.releaseDate}</div>
                    <Link to={`/detail/${this.props.id}`}>
                        {this.props.title}
                    </Link>
                </figcaption>
            </figure>);
    }
}

export default MovieItem;