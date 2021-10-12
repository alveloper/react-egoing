import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import {Article} from './components/Article'


function Nav(props) {
  var lis = [];
  function aHandler(ev) {
    ev.preventDefault();
    props.onSelect(Number(ev.target.dataset.id));
  }
  for (var i = 0; i < props.src.length; i++) {
    var item = props.src[i];
    lis.push(
      <li key={item.id}>
        <a href={item.id + ".html"} data-id={item.id} onClick={aHandler}>
          {item.title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}
function Header(props) {
  function aHandler(ev) {
    ev.preventDefault();

    props.onSelect();
  }
  return (
    <header>
      <h1>
        <a href="index.html" onClick={aHandler}>
          {props.title}
        </a>
      </h1>
    </header>
  );
}
function Create(props) {
  function submitHandler(ev) {
    ev.preventDefault();
    var title = ev.target.title.value;
    var body = ev.target.body.value;
    props.onCreate(title, body);
  }
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={submitHandler}>
        <p>
          <input type="text" name="title" defaultValue="a"/>
        </p>
        <p>
          <textarea name="body" defaultValue="b"></textarea>
        </p>
        <p>
          <input type="submit" />
        </p>
      </form>
    </article>
  );
}
function Update(props) {
  var [title,setTitle] = useState(props.data.title);
  var [body,setBody] = useState(props.data.body);
 
  function submitHandler(ev) {
    ev.preventDefault();
    var title = ev.target.title.value;
    var body = ev.target.body.value;
    props.onUpdate(title, body);
  }
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={submitHandler}>
        <p>
          <input type="text" name="title" value={title} onChange={function(e){
              setTitle(e.target.value)
          }}/>
        </p>
        <p>
          <textarea name="body"  value={body} onChange={function(e){
              setBody(e.target.value)}}></textarea>
        </p>
        <p>
          <input type="submit" />
        </p>
      </form>
    </article>
  );
}
function Control(props) {
  return (
    <ul>
      <li>
        <a href="create.html" onClick={(ev) => {
            ev.preventDefault();
            props.onChangeMode('CREATE');
          }}>
          Create
        </a>
      </li>
      <li>
        <a href="update.html" onClick={(ev) => {
            ev.preventDefault();
            props.onChangeMode('UPDATE');
          }}>
          Update
        </a>
      </li>
      <li>
          <form onSubmit={
            function(ev){
              ev.preventDefault();
              props.onChangeMode('DELETE')
            }
          }>
            <input type="submit" value="delete"/>
          </form>
      </li>
      
    </ul>
  );
}
function App() {
  console.log("run App");
  var [id, setId] = useState(undefined);
  var [mode, setMode] = useState("WELCOME");
  var [nextId, setNextId] = useState(3);
  var [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is .." },
    { id: 2, title: "css", body: "css is .." },
  ]);
  function selectHandler(_id) {
    if (_id === undefined) {
      setMode("WELCOME");
    } else {
      setId(_id);
      setMode("READ");
    }
  }
  var articleComp = <Article title="Welcome" body="Welcome is ..."></Article>;
  if (mode === "READ") {
    var title, body;
    for (var i = 0; i < topics.length; i++) {
      var item = topics[i];
      if (item.id === id) {
        title = item.title;
        body = item.body;
      }
    }
    articleComp = <Article title={title} body={body}></Article>;
  } else if (mode === "CREATE") {
    function createHandler(_title, _body) {
      const newTopics = [...topics];

      newTopics.push({ id: nextId, title: _title, body: _body });
      setTopics(newTopics);
      setMode("READ");
      setId(nextId);
      setNextId(nextId + 1);
    }
    articleComp = <Create onCreate={createHandler}></Create>;
  }else if (mode === "UPDATE") {

    function updateHandler(_title, _body) {
      var newTopics  = [];
      for(var i=0; i<topics.length; i++){
        var topic= topics[i];
        if(topic.id === id){
          newTopics.push({id:id, title:_title, body:_body})
        }else{
          newTopics.push(topic)
        }
      }

      setTopics(newTopics);
      setMode("READ");
    }
    var data;
    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      if (topic.id === id) {
        data = topic
      }
    }
    articleComp = <Update onUpdate={updateHandler} data={data}></Update>;

  }

  function  changeHandler(_mode) {
   // debugger;
    if(_mode ==='DELETE'){
      var newTopics =[];
      for(var i = 0; i<topics.length; i++){
        if(topics[i].id === id){
          
        }else{
          newTopics.push(topics[i])
        }
        setTopics(newTopics);
        setMode('WELCOME')
      }
    } else if(_mode === 'UPDATE'){
      setMode('UPDATE');
    }else{
      setMode(_mode);
    }
    
  }
  return (
    <div>
      <Header title="html" onSelect={selectHandler}></Header>
      <Nav src={topics} onSelect={selectHandler}></Nav>
      {articleComp}
      <Control onChangeMode={changeHandler}></Control>
    </div>
  );
}

export default App;
