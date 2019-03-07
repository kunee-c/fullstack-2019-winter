/**
 * Created by kunee on 04/03/2019.
 */
import React, { Component } from 'react';
import MovieItem from './MovieItem';
//import Pagination from 'react-bootstrap/Pagination'

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class MoviesList extends Component{

    constructor() {
        super();
    }


    render() {
        let pages = [];
        let nbPages = 0;

        if(this.props.nbPages > 20)
            nbPages = 20;
        else
            nbPages = this.props.nbPages;

        for(let i =1 ; i<= nbPages; i++) {
            pages.push(<PaginationItem key={i} active={i === this.props.currentPage} >
                            <PaginationLink onClick={this.props.loadMovies.bind(this, i)}>
                                {i}
                            </PaginationLink>
                        </PaginationItem>)
        }

        return(

            <div>
                <div className="row mt-3 mb-5">
                    {this.props.movies.map(movie => {
                        return <MovieItem key={movie.id} id={movie.id} title={movie.title} imgUrl={movie.imgUrl} releaseDate={movie.releaseDate}/>
                        })
                    }
                </div>

                <div className="fixed-bottom">

                    <div className="d-flex justify-content-center">
                        <Pagination size="sm" aria-label="Page navigation example">
                            {pages}
                        </Pagination>
                    </div>


                </div>

            </div>
        );
    }


}



export default  MoviesList;