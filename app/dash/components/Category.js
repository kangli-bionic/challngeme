import React from 'react';

export function Category(props){

    function onClick(event){
        const $category = $(event.target).closest('.small-box');
        let category = {
            id: props.category.id
        };
        $category.animateCss('swing');
        $category.toggleClass('selected', (selected) => {
            category.selected = selected;
            props.toggleCategory(category);
        });

    }
    return (
        <div className="col-lg-3 col-xs-6 col-md-4 category">
            <div className="small-box bg-aqua" onClick={onClick}>
                <div className="inner" >
                    <h3>{props.category.name}</h3>
                    <p>{props.category.description}</p>
                </div>
                <div className="icon">
                    <i className="fa fa-shopping-cart"></i>
                </div>
                <a href="#" className="small-box-footer">
                    Details <i className="fa fa-arrow-circle-right"></i>
                </a>
            </div>
        </div>
    );
}

export class CategoryForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            categories: [],
            selected: []
        }

        this.toggleCategory = this.toggleCategory.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentDidMount(){
        const that = this;
        $.get('/dash/category')
            .done((data) => {
                that.setState({
                     categories: data
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    toggleCategory(category){
        let selected = [];
        selected.push(category);

        this.setState((prevState, props) => ({
            selected: prevState.selected.concat(selected).filter((cat) => {
                return cat.selected;
            })
        }));
    }

    onSave(event){
        console.log('send selected categories to the server');
        console.log(this.state.selected);
    }

    render(){
        const categories = this.state.categories.map((category) =>{
           return <Category toggleCategory={this.toggleCategory} key={category.id} category={category}/>
        });

        return (
          <div className="row">
              <form>
                  {categories}
                  <div className="col-md-12 pull-right">
                      <button type="button" className="btn btn-lg btn-flat" onClick={this.onSave}>Next</button>
                  </div>
              </form>
          </div>
        );
    }

}