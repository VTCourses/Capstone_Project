import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ImageList() {
  return (
    <Container>
      <Row>
        {/* This section allow the changes of how many images to be displayed, currently the setting is 4 total images to be displayed*/}
        {Array.from({ length: 4 }).map((element, index) => {
          return (
            <Col sm={6} md={4} className="mt-3">
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src="https://mdbootstrap.com/img/new/fluid/city/055.webp"
                />
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>Small description</Card.Text>
                  {/* If user want to display further detail, this button can be used to navigate to another tab -- Not yet implemented */}
                  <Button variant="primary">Display details</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default ImageList;
