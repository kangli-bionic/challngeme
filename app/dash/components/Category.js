import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';

export function Category(props){

    function onClick(event){
        const $category = $(event.target).closest('.small-box');
        let category = {
            id: props.category.id
        };
        $category.animateCss('rubberBand');
        $category.toggleClass('selected', (selected) => {
            props.toggleCategory(category, selected);
        });

    }
    return (
        <div className="col-lg-3 col-xs-6 col-md-4 category">
            <div className={constants.backgrounds[Math.floor(Math.random() * (constants.backgrounds.length - 1))] + ' small-box '
            + (props.selected ? 'selected' : '')}
                 onClick={onClick}>
                <div className="inner" >
                    <h3>{props.category.name}</h3>
                    <p>{props.category.description}</p>
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
            newUser: cookie.load(constants.cookies.NEW_USER),
            userId: cookie.load(constants.cookies.USER_ID)
        }
        this.selected =[];
        this.toggleCategory = this.toggleCategory.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentDidMount(){
        const that = this;
        $.get('/dash/getCategories', {userId: this.state.userId})
            .done((data) => {
                that.setState({
                     categories: data
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    toggleCategory(category, selected){
        this.selected.push(category);
        this.selected = this.selected.filter((cat) => {
            if(cat.id == category.id && !selected){
                return false;
            }else{
                return true;
            }
        });
    }

    onSave(event){
        event.preventDefault();
        $.post('/dash/saveCategory', {
                selected: this.selected,
                userId: this.state.userId,
                newUser: this.state.newUser
        })
            .done((data) => {
                cookie.remove(constants.cookies.NEW_USER, {path: '/'});
                cookie.save(constants.cookies.NEW_USER, false, {path: '/'});
                this.setState({
                    newUser: data.newUser
                });
                this.props.router.push(data.redirect);
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        const categories = this.state.categories.map((category) =>{
           return <Category toggleCategory={this.toggleCategory} key={category.id} category={category}/>
        });

        return (
            <div className="row">
                <form onSubmit={this.onSave}>
                    {categories}
                    <div className="col-md-12 pull-right">
                        <button type="submit" className="btn btn-lg btn-flat">{
                            (this.state.newUser == "true") ? 'Next' : 'Save'
                        }</button>
                    </div>
                </form>
            </div>
        )

    }

}