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

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Jumbotron fluid>
              <Container fluid>
                <h1 className="display-5">You are not authorized to view this page</h1>
              </Container>
            </Jumbotron>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Authorization;