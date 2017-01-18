import React from 'react';

export function Category(props){

    return (
        <div className="col-lg-3 col-xs-6 col-md-4 category"
             data-anijs="if: click, do: flipInY animated">
            <div className="small-box bg-aqua">
                <div className="inner" >
                    <h3>{props.name}</h3>
                    <p>{props.description}</p>
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
            categories: []
        }
    }

    componentDidMount(){
        const that = this;
        $.get('/dash/category')
            .done((data) => {
                console.log(data);
                that.setState({
                     categories: data
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        const categories = this.state.categories.map((category) =>{
           return <Category key={category.id} name={category.name}
                description={category.description}/>
        });

        return (
          <div className="row">
              <form>
                  {categories}
              </form>
          </div>
        );
    }

}