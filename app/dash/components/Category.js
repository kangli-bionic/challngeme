import React from 'react';
import {browserHistory} from 'react-router';
import {constants} from '../../common/constants';
import {Glyphicon} from '../../common/components/Glyphicon';
import cookie from 'react-cookie';

export function Category(props){

    const onClick = (event) => {
        const $category = $(event.target).closest('.small-box');
        let categoryId = props.category.id;

        $category.animateCss('jello');
        $category.toggleClass('selected', (selected) => {
            $category.find('.selection-mark').toggleClass('hide', () => {});
            props.toggleCategory(categoryId, selected);
        });

    }

    return (
        <div className="col-lg-4 col-xs-12 col-md-4 category">
            <div className={`${constants.backgrounds[Math.floor(Math.random() * (constants.backgrounds.length - 1))]} small-box
             ${(props.category.selected ? 'selected' : '')}`}
                 onClick={onClick}>
                <div className="inner" >
                    <h3>{props.category.name}</h3>
                    <span className={`selection-mark ${props.category.selected ? '' : 'hide'} `}>
                        <Glyphicon centerBlock="" icon="ok-circle"/>
                    </span>
                    <p>{props.category.description}</p>
                </div>
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
        this.update = true;
        $.get('/dash/getCategories', {userId: this.state.userId})
            .done((data) => {
                that.setState(() => {
                    that.selected = data.map((cat) => {
                        if(cat.selected != 0){
                            return cat.id;
                        }else{
                            return cat.selected;
                        }
                    });

                    return {
                        categories: data
                    }
                });

            })
            .fail(() => {
                this.props.showNotification(constants.error.GENERIC, constants.notifications.DANGER);
            });
    }

    shouldComponentUpdate(){
        return this.update;
    }

    toggleCategory(categoryId, selected){

        this.selected.push(categoryId);
        this.selected = this.selected.filter((id) => {
            if((id == categoryId && !selected) || id == 0){
                return false;
            }else{
                return true;
            }
        });
    }

    onSave(event){
        event.preventDefault();

        this.selected = this.selected.filter((id) => {
            return id != 0;
        });
        if(this.selected.length <= 0){
            this.props.showNotification(constants.error.CATEGORY, constants.notifications.DANGER);
            return;
        }
        $.post('/dash/saveCategory', {
                selected: this.selected,
                userId: this.state.userId,
                newUser: this.state.newUser
        })
            .done((data) => {
                cookie.save(constants.cookies.NEW_USER, false, {path: '/'});
                this.setState({
                    newUser: data.newUser
                });
                browserHistory.push(data.redirect);
            })
            .fail(() => {
                this.props.showNotification(constants.error.CATEGORY, constants.notifications.DANGER);
            });
    }

    render(){
        const categories = this.state.categories.map((category) =>{
           return <Category toggleCategory={this.toggleCategory} key={category.id} category={category}/>
        });

        this.update = false;

        return (
            <div className="row">
                <form onSubmit={this.onSave}>
                    {categories}
                    <div style={{clear: 'both'}}></div>
                    <div className="col-md-12">
                        <div className="pull-right" style={{marginBottom:'15px'}}>
                            <button type="submit" className="btn btn-lg btn-flat start btn-success">{
                                (this.state.newUser == "true") ? 'Next' : 'Save'
                            }</button>
                        </div>
                    </div>
                </form>
            </div>
        )

    }

}