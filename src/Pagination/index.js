import React, {Component} from 'react';


const defaultProps = {
  page: 1,
  limit: 0,
  total: 0,
  show: true,
}

// let strSize = 5;
const paginationItemStyle = {
  cursor: 'pointer',
}

export default class Pagination extends Component{

  constructor(props){

    super(props);

    this.state = {}
  }

  setPage(page){
    if(this.props.onChangePage){
      this.props.onChangePage(page);
    }
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentDidUpdate(){

    if(this.props.debug){
      console.log("Pagination componentDidUpdate", this);
    }
  }

  render(){

    let {show, page, limit, total} = this.props;

    if(!show || !page || !limit || !total){
      return null;
    }
 
    let pages = Math.floor(total/limit);

    var rows = [];
    if(page > 1){
      rows.push(<li key='page-1' className="control"><span style={paginationItemStyle} onClick={this.setPage.bind(this,1)}>Первая</span></li>);
      rows.push(<li key='page-1-0' className="control"><span style={paginationItemStyle} onClick={this.setPage.bind(this,page-1)}>«</span></li>);
    }

    var lstr = false;
    var rstr = false;
    for(var i = 1; i <= pages; i++){
      if(
        (
          page -1 > 3
          && i < page -1
          && i > 1
        )
        || (
          pages - page > 3
          && i > page +1
          && i < pages -1
        )
      ){
        if(!lstr && i > 1 && i < page){
          rows.push(<li key={i}><span>...</span></li>);
          lstr = true;
        }
        if(!rstr && i > page && i < pages){
          rows.push(<li key={i}><span>...</span></li>);
          rstr = true;
        }
      }
      else {
        rows.push(<li key={i} className={i != page || 'active'}><span style={paginationItemStyle} onClick={this.setPage.bind(this,i)}>{i}</span></li>);
      }
    }
    if(page < pages){
      rows.push(<li key={'page-'+ pages +'-0'} className="control"><span style={paginationItemStyle} onClick={this.setPage.bind(this,page+1)}>»</span></li>);
      rows.push(<li key={'page-'+ pages} className="control"><span style={paginationItemStyle} onClick={this.setPage.bind(this,pages)}>Последняя</span></li>);
    }

    return (
      <div className="pagination">
        <ul className="pagination">
          {rows}
        </ul>
      </div>
    )
  }
}

Pagination.defaultProps = defaultProps;