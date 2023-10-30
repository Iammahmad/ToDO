import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPaperPlane} from '@fortawesome/free-solid-svg-icons';

function MyApp() {
  const savedListString = localStorage.getItem('list');
  const savedList = savedListString ? JSON.parse(savedListString) : []; 
  
  const savedEdit = localStorage.getItem('Edit');
  const parseEdit = savedEdit ? JSON.parse(savedEdit) : []; 

  const savedcheck = localStorage.getItem('checked');
  const parsecheck = savedcheck ? JSON.parse(savedcheck) : [];

  const savedbtn = localStorage.getItem('btnVal');
  const parsebtn = savedbtn ? JSON.parse(savedbtn) : [];

  const [input,setinput] = useState<string>("");
  const [list,setlist] = useState<string[]>(savedList);
  const [Edit,setEdit] = useState<boolean[]>(parseEdit)
  const [checked, setChecked] = useState<boolean[]>(parsecheck);
  const [btnVal, setbtnVal] = useState<any>(parsebtn);
  const [filter, setFilter] = useState("all");
  const [isSliderOpen, setSliderOpen] = useState(false);


  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
    localStorage.setItem("Edit", JSON.stringify(Edit));
    localStorage.setItem("checked", JSON.stringify(checked));
    localStorage.setItem("btnVal", JSON.stringify(btnVal));
    console.log(localStorage);
    
    
  }, [list, Edit, checked, btnVal]);

  function submit(){
    if(input){
      
      setEdit([...Edit, false]);
      setlist([...list,input])
      setinput("")
      setChecked([...checked, false]);
      setbtnVal([...btnVal,"Edit"])
    }
    
  }
  const mylist = list.map((element, index) => {
    if (
      filter === "all" ||
      (filter === "checked" && checked[index]) ||
      (filter === "unchecked" && !checked[index])
    ) {
      return (
        <div className="list-Itmes" key={index}>
          <input
            className="checkbox"
            type="checkbox"
            onChange={() => handleCheck(index)}
            checked={checked[index]}
            disabled={checked[index]}
          />
           <span style={{ textDecoration: checked[index] ? 'line-through' : 'none', color:"white"}}>
            ToDo</span>
          <input
            className="items"
            type="text"
            value={element}
            readOnly={!Edit[index]}
            onChange={(i) => {
              if (Edit[index]) {
                const updateTask = [...list];
                updateTask[index] = i.target.value;
                setlist(updateTask);
              }
            }}
            style={{ background: Edit[index]? "white" : ""}}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEdit(index)
              }
            }}
          />
          <button className="listBtn" onClick={() => handleEdit(index)}>
            {btnVal[index]}
          </button>
          <button className="listBtn" onClick={() => handleDelete(index)}>
            {<FontAwesomeIcon icon={faTrash} />}
          </button>
        </div>
      );
    }
    return null;
  });

  function handleCheck(index:number){
    const check = [...checked]
    check[index] = !check[index]
    setChecked(check);

  }

  function handleDelete(index:number){
  const dlist = list.filter((x,y)=> y!==index );
  setlist(dlist)
  const dedit = Edit.filter((x,y)=> y!==index );
  setEdit(dedit)
  const dchecked = checked.filter((x,y)=> y!==index );
  setChecked(dchecked)
  }
  function handleEdit(index:number){
    const btn = [...btnVal]
    if(btn[index]=== "Edit"){
      btn[index] = "Done";
      setbtnVal(btn);
    }else if(btn[index]=== "Done"){
      btn[index] = "Edit";
      setbtnVal(btn);
    }
    const update = [...Edit]
    update[index] = !update[index]
    setEdit(update);
  }
  function ClearBtn() {
    function clear() {
      setlist([]);
      setChecked([]);
      setEdit([])
      setbtnVal([])
      
    }
    if(list.length >1){
      return (
        <button className="clearBtn" onClick={()=>clear()}>Clear All</button>
      );
    }
    else{
      return null;
    }

  }
  function toggleSlider() {
    setSliderOpen(!isSliderOpen);
  };

  return (
    <>
    <div className="content-wrapper">
      <h1 className="heading">ToDO List</h1>
      <div className="header">
      <div className="entry">
        <input className="add" type="text" value={input} onChange={(i) => setinput(i.target.value)}
           onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submit();
            }
          }} placeholder="Enter Your ToDo Tasks..."/>
        <button className="listBtn" onClick={() => submit() }>{ <FontAwesomeIcon icon={faPaperPlane} />}</button>
        <div className="filter">
        <button className="filterBtn" onClick={() => toggleSlider() }>Filter</button>
        <div className={`filter-container ${isSliderOpen ? 'open' : ''}`}>
            <button className="filter-item" 
            onClick={() => {setFilter("all");toggleSlider();}}>All</button>
            <button className="filter-item" 
            onClick={() => {setFilter("checked"); toggleSlider(); }}>Done</button>
            <button className="filter-item" 
            onClick={() => { setFilter("unchecked"); toggleSlider(); }}>ToDo</button>

          </div>
          </div>
      </div>

          </div>
      <>{mylist}</>
      <ClearBtn/>
    </div>
    </>
  );
}

export default MyApp;
