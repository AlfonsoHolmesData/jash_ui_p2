import {useState, useEffect} from "react";
import {Principal} from "../dtos/principal";
import DeleteCollectionModal from "./collection-modals/DeleteCollectionModal";
import CreateCollectionModal from "./collection-modals/CreateCollectionModal";
import EditCollectionModal from "./collection-modals/EditCollectionModal";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { Collections } from "../dtos/collection";
import {getFavorites, getSavedCollections, unfavorite} from "../remote/user-service";
import { Redirect , Link } from "react-router-dom";
import { colors } from "@material-ui/core";
import { FormControl, Input, InputLabel, makeStyles, Typography} from "@material-ui/core";


interface IManageProps {
    currentUser: Principal | undefined;
    setCurrCollection: (nextCollection: Collections | undefined) => void
}
const useStyles = makeStyles({
    ManageContainer: {
        backgroundColor: "black",
        opacity: .94,
        justifyContent: "center",
        marginLeft: "10rem",
        marginTop: "5rem",
        width: "75%",
        height:"75%",
        borderRadius: "8em",
        border: "white",
    }
}) 

const buttonStyle = {
    backgroundColor: '#5f2568',
    border: '#5f2568',
    color: "gold",
    marginLeft: '1em'
}
function ManageCollectionComponent(props: IManageProps) {
    let [collections , setCollections] = useState([] as Collections[]);
    let [favorites , setFavorites] = useState([] as Collections[]);
    let [errorMessage, setErrorMessage] = useState('');
    let [hasCollections, setHasCollections] = useState(false);
    let [showDelete, setShowDelete] = useState(false);
    let [showCreate, setShowCreate] = useState(false);
    let [showEdit, setShowEdit] = useState(false);
    let [currentCollection, setCurrentCollection] = useState(undefined as Collections | undefined);

    useEffect(() => {
        if(!hasCollections) {
            fillCollections();
            fillFavorites();
            setHasCollections(true);
        }
    })

    async function fillCollections() {    
        try {   
            if(props.currentUser) {
                //@ts-ignore
                let user_id = props.currentUser.id;
                let temp = await getSavedCollections( user_id, props.currentUser.token );
                if(temp) {
                    setCollections(temp);
                } else {
                    return;
                }
            }

        } catch (e: any) {
            setErrorMessage(e.message); 
        }

            
    }

    async function fillFavorites() {    
        try {   
            if(props.currentUser) {
                let user_id = props.currentUser.id;
                let favorited : Collections[] | undefined = await getFavorites(props.currentUser.id, props.currentUser.token)
                setFavorites(favorited as Collections[]);
            }
        } catch (e: any) {
            setErrorMessage(e.message); 
        }   
    }


    function edit(collection : Collections | undefined) {
        if(!collection) {
            return;
        }

        setShowEdit(true);
        setCurrentCollection(collection);
        return undefined;
    }

    function editUI(collection : Collections | undefined) {
        if(!collection) {
            return;
        }
        let temp = collections;
        temp.forEach((c:Collections) => {
            if(c.id === collection.id) {
                console.log(c)
                c.title = collection.title;
                c.description = collection.description;
                c.category = collection.category;
            }
        })
        console.log(temp)
        setCollections(temp);
    }

    function remove(collection : Collections | undefined) {
        if(!collection) {
            return;
        }

        setShowDelete(true);
        setCurrentCollection(collection);

        return undefined;
    }

    function removeUI(collection : Collections | undefined) {
        if(!collection) {
            return;
        }

        console.log(collection.id)
        let temp = collections;
        temp = temp.filter((c : Collections) => {
            return !(c.id === collection.id)
        })
        console.log(temp);
        setCollections(temp);
    }

    function createUI(collection : Collections | undefined) {
        if(!collection) {
            return;
        }

        console.log(collection.id)
        let temp = collections;
        temp.push(collection);
        console.log(temp);
        setCollections(temp);
    }

    async function create() {
        setShowCreate(true);
        return undefined;
    }

    function unfavoriteCollection(collection : Collections | undefined) {
        if(collection) {
            try{
                unfavorite(props.currentUser?.id as string, collection.id, props.currentUser?.token as string)
                let temp : Collections[] = favorites.filter((c : Collections) => {
                    return !(c.id === collection.id)
                })
                setFavorites(temp);
            } catch (e : any) {
                setErrorMessage(e);
            }
        }
    }

    function getComponent() {
        if(showDelete) {
            return <DeleteCollectionModal current_user={props.currentUser} collection={currentCollection} show={showDelete} setShow={setShowDelete} updateUI={removeUI}/>;
        } else if(showCreate) {
            return <CreateCollectionModal current_user={props.currentUser} show={showCreate} setShow={setShowCreate} updateUI={createUI}/>;
        } else if(showEdit){
            return <EditCollectionModal current_user={props.currentUser}  collection={currentCollection} show={showEdit} setShow={setShowEdit} updateUI={editUI}/>;
        }
    }
    const classes = useStyles();
    return (
        props.currentUser
        ?
        <>
            <div id = "manage-component" className={classes.ManageContainer}>
            <br></br>
            <br></br>
            <h1 style = {{color: ' #FFD93D', marginLeft: '1em'}}>My Collections</h1>
            <Table  striped bordered hover variant="dark">
                    <thead>
                        <tr>
                          <td>Title</td>
                          <td>Category</td>
                          <td>Description</td>
                          <td>Author</td>
                          <td>Question Count</td>
                          <td>Manage</td>
                        </tr>
                    </thead>
                    <tbody>
                    {collections?.map((C : Collections | undefined, i) =>{
                           
                        return  <tr key={i}>
                                    <td>{C?.title} </td>
                                    <td>{C?.category}</td>
                                    <td>{C?.description}</td>
                                    <td>{C?.author.username}</td>
                                    <td>{C?.questionList.length}</td>
                                    <td>
                                    <Button style ={buttonStyle}variant="secondary" onClick={() => edit(C)}>Edit</Button> {  }
                                    <Button style ={buttonStyle} variant="secondary" onClick={() => remove(C)}>Delete</Button> {  }
                                    <Link to="/view-collection" style ={buttonStyle} className="btn btn-secondary" onClick={() => props.setCurrCollection(C)}>View</Link> {  }
                                    </td>
                                </tr> 
                    })}
                    {getComponent()}
                    </tbody>
                </Table>

                <Button style ={buttonStyle} variant="secondary" onClick={create}>Create New Collection</Button>

                <br></br>
                <h1 style = {{color: '#FFD93D', marginLeft: '1em'}}>Favorites</h1>
                <Table  striped bordered hover variant="dark">
                    <thead>
                        <tr>
                          <td>Title</td>
                          <td>Category</td>
                          <td>Description</td>
                          <td>Author</td>
                          <td>Question Count</td>
                          <td>Manage</td>
                        </tr>
                    </thead>
                    <tbody>
                    {favorites?.map((C : Collections | undefined, i) =>{
                           
                        return  <tr key={i}>
                                    <td>{C?.title} </td>
                                    <td>{C?.category}</td>
                                    <td>{C?.description}</td>
                                    <td>{C?.author.username}</td>
                                    <td>{C?.questionList.length}</td>
                                    <td>
                                    <Button style= {buttonStyle} variant="secondary" onClick={() => unfavoriteCollection(C)}>Unfavorite</Button> {  }
                                    <Link to="/discover-questions" style ={buttonStyle} className="btn btn-secondary" onClick={() => props.setCurrCollection(C)}>View</Link> {  }
                                    </td>
                                </tr> 
                    })}
                    {getComponent()}
                    </tbody>
                </Table>
                </div>      
        </>
        :
        <Redirect to="/login"/>
    )
}
export default ManageCollectionComponent;