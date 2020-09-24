import React from 'react';
import './App.css';

let Url = 'http://192.168.1.9:3000';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      person: null,
      aux: {
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        points: ''
      },
      edit: false,
      editingText: "",
      add: false,

    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeEncryptedPassword = this.handleChangeEncryptedPassword.bind(this);
    this.handleChangeToken = this.handleChangeToken.bind(this);
    this.handleChangeFirstname = this.handleChangeFirstname.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangePoints = this.handleChangePoints.bind(this);
  }


  async componentDidMount() {
    console.log(this.state.aux)
    this.setState({ edit: false })
    const url = Url + '/showusers';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    this.setState({ person: data, loading: false });
    //console.log(this.state.person[0].email)


  }

  async handleDeleteUserindex(person, index) {


    let data = JSON.stringify(person)
    console.log('data', person.user_id)


    await fetch(Url + '/deleteuser', {
      method: 'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json'
      },
      body: data
    });

    this.componentDidMount()

  }

  handleAddUser() {
    //Criação de array para recber os dados do novo user
    let auxiliar = this.state.aux
    let data = JSON.stringify(auxiliar)

    //Comunicação com o endpoint da API
    fetch(Url + '/createaccount', {
      method: 'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json'
      },
      body: data
    }).then(
      //Remove a possibilidade de edição
      this.setState({ edit: false })
    )
    //Faz refreah da pagina
    window.location.reload()
  }


  async handleSaveUserindex(person, index) {

    this.setState({ edit: false })

    console.log('PERSON', person)

    let data = JSON.stringify(person)

    await fetch(Url + '/updateuser', {
      method: 'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json'
      },
      body: data
    });

  }



  renderTableHeader() {
    let header = Object.keys(this.state.person[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {

    return this.state.person.map((person, index) => {
      const { user_id, username, email, encryptedPassword, token, firstname, lastname, points } = person //destructuring
      return (
        <tr key={user_id}>
          <td>{user_id}</td>
          <td>{username}</td>
          <td>{email}</td>
          <td>{encryptedPassword}</td>
          <td>{token}</td>
          <td>{firstname}</td>
          <td>{lastname}</td>
          <td>{points}</td>
          <button onClick={() => this.handleDeleteUserindex(person, index)}>Remover Utilizador</button>
          <button onClick={() => this.setState({ edit: true })}>Editar Utilizador</button>
        </tr>
      )
    })
  }


  renderTableDataEdit() {
    return this.state.person.map((person, index) => {
      const { user_id, username, email, encryptedPassword, token, firstname, lastname, points } = person //destructuring
      return (
        <tr key={user_id}>
          <td>{user_id}</td>
          <td><input type="text" defaultValue={username} onChange={evt => this.handleChangeUsername(evt, index)} /></td>
          <td><input type="text" defaultValue={email} onChange={evt => this.handleChangeEmail(evt, index)} /></td>
          <td>{encryptedPassword}</td>
          <td>{token}</td>
          <td><input type="text" defaultValue={firstname} onChange={evt => this.handleChangeFirstname(evt, index)} /></td>
          <td><input type="text" defaultValue={lastname} onChange={evt => this.handleChangeLastname(evt, index)} /></td>
          <td><input type="text" defaultValue={points} onChange={evt => this.handleChangePoints(evt, index)} /></td>
          <td><button onClick={() => this.componentDidMount()}>Cancelar Edição</button>
            <button type="button" onClick={() => this.handleSaveUserindex(person, index)}>Guardar Utilizador</button></td>
        </tr>

      )
    })
  }






  handleChangeUsername(event, index) {
    const person = this.state.person;
    person[index].username = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeUsername2(event) {
    const aux = this.state.aux;
    aux.username = event.target.value;
    this.setState({
      aux
    });
  }
  handleChangeEmail(event, index) {
    const person = this.state.person;
    person[index].email = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeEmail2(event) {
    const aux = this.state.aux;
    aux.email = event.target.value;
    this.setState({
      aux
    });
  }
  handleChangeEncryptedPassword(event, index) {
    const person = this.state.person;
    person[index].encryptedPassword = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeEncryptedPassword2(event) {
    const aux = this.state.aux;
    aux.password = event.target.value;
    this.setState({
      aux
    });
  }
  handleChangeToken(event, index) {
    const person = this.state.person;
    person[index].token = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeFirstname(event, index) {
    const person = this.state.person;
    person[index].firstname = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeFirstname2(event) {
    const aux = this.state.aux;
    aux.firstname = event.target.value;
    this.setState({
      aux
    });
  }
  handleChangeLastname(event, index) {
    const person = this.state.person;
    person[index].lastname = event.target.value;
    this.setState({
      person
    });
  }
  handleChangeLastname2(event) {
    const aux = this.state.aux;
    aux.lastname = event.target.value;
    this.setState({
      aux
    });
  }
  handleChangePoints(event, index) {
    const person = this.state.person;
    person[index].points = event.target.value;
    this.setState({
      person
    });
  }
  handleChangePoints2(event) {
    const aux = this.state.aux;
    aux.points = event.target.value;
    this.setState({
      aux
    });
  }


  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.person) {
      return <div>didn't get a person</div>;
    }

    if (this.state.edit) {
      return (
        <div>
          <table id='students'>
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTableDataEdit()}
            </tbody>
          </table>

        </div >
      )
    }
    else if (!this.state.edit) {
      return (
        <div>
          <table id='students'>
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTableData()}
              <tr>
                <td>ID</td>
                <td><input type="text" onChange={evt => this.handleChangeUsername2(evt)} /></td>
                <td><input type="text" onChange={evt => this.handleChangeEmail2(evt)} /></td>
                <td><input type="text" onChange={evt => this.handleChangeEncryptedPassword2(evt)} /></td>
                <td>TOKEN</td>
                <td><input type="text" onChange={evt => this.handleChangeFirstname2(evt)} /></td>
                <td><input type="text" onChange={evt => this.handleChangeLastname2(evt)} /></td>
                <td><input type="text" onChange={evt => this.handleChangePoints2(evt)} /></td>
                <td><button type="button" onClick={() => this.handleAddUser()}>Adicionar Utilizador</button></td>

              </tr>
            </tbody>
          </table>
        </div >
      );
    }

  }
}

export default App;
