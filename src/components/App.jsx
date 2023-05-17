import { Component } from "react";
import SearchQuery from './SearchQuery/SearchQuery'
export class App extends Component{

state={
    searchWord:'',
  }

  onSubmit = (e)=>{
    e.preventDefault();
    
    this.setState({ searchWord: e.target.searchWord.value.trim() })
  }
  render (){
  return (
    <div
      style={{
        height: '100vh',
        display: 'bloc',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101'
      }}
    >
    <SearchQuery/>
    </div>
  );}
};
