import React from 'react';
import {constants} from '../../common/constants';
import cookie from 'react-cookie';
import {Challenge} from './Challenge';

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
            <div className={constants.backgrounds[Math.floor(Math.random() * (constants.backgrounds.length - 1))] + ' small-box'}
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

    onSave(){
        $.post('/dash/category', {
                selected: this.selected,
                userId: this.state.userId
        })
            .done((data) => {
                cookie.save(constants.cookies.NEW_USER, false)
                this.setState({
                    newUser: data.newUser
                });
            })
            .fail((err) => {
                console.log(err);
            });
    }

    render(){
        const categories = this.state.categories.map((category) =>{
           return <Category toggleCategory={this.toggleCategory} key={category.id} category={category}/>
        });

        if (this.state.newUser == "true") {
            return (
                <div className="row">
                    <form>
                        {categories}
                        <div className="col-md-12 pull-right">
                            <button type="button" className="btn btn-lg btn-flat" onClick={this.onSave}>{
                                (this.state.newUser == "true") ? 'Next' : 'Save'
                            }</button>
                        </div>
                    </form>
                </div>
            )
        }else{
            return (
                <div className="row">
                    <Challenge userId={this.state.userId}/>
                </div>
            )
        }
    }

}