import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ImageList() {
  return (
    <Container>
      <Row>
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
                  <Card.Text>Test text</Card.Text>
                  <Button variant="primary">Go somewhere</Button>
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
