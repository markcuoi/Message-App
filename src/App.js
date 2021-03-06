import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { auth } from "./firebase/firebase.utils";
import Header from "./pages/header/header.component";
import HomePage from "./pages/homepage/homepage.component";
import Login from "./pages/login/login.component";
import { setCurrentUser, listAllUser } from "./redux/user/user.actions";
import { createUserProfileDocument } from "./firebase/firebase.utils";
import { firestore } from "./firebase/firebase.utils";
import { setSelectedUser } from "./redux/user/user.actions";
import "./App.css";

const App = (props) => {
  const { currentUser, setCurrentUser, listAllUser, setSelectedUser } = props;
  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          firestore.collection("users").onSnapshot((querySnapshot) => {
            var users = [];
            querySnapshot.forEach((doc) => {
              if (snapShot.id !== doc.id)
                users.push({ id: doc.id, ...doc.data() });
            });
            listAllUser(users);
          });

          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);
    });
    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  return (
    <div className="app">
      <Header></Header>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (currentUser ? <HomePage /> : <Redirect to="/login" />)}
        />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
  selectedUser: user.selectedUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  listAllUser: (allUser) => dispatch(listAllUser(allUser)),
  setSelectedUser: (user) => dispatch(setSelectedUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
