import React, {Component} from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Jumbotron, Button, Container
} from 'reactstrap';

class Authorization extends Component {

  componentDidMount() {
    document.body.classList.toggle('sidebar-minimized');
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody    style={{width: "100%",textAlign: "center",height: "100%",color: "#cc0909",backgroundColor: "#f7f3f0"}}>
            <Jumbotron fluid style={{backgroundColor:"#f7f3f0"}}>
              <Container fluid>
                <h1 style={{ fontSize: "26px"}} className="display-5">You are not authorized to view this page</h1>
              </Container>
            </Jumbotron>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Authorization;