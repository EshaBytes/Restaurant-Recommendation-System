
import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../utils/api';
import { Card, Button, Spinner, Container, Row, Col } from 'react-bootstrap';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.favorites || []);
    } catch (error) {
      alert('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter((fav) => fav._id !== id));
    } catch (error) {
      alert('Failed to remove favorite');
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Favorite Restaurants ❤️</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <Row>
          {favorites.map((restaurant) => (
            <Col md={4} key={restaurant._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={restaurant.image || '/default-restaurant.jpg'}
                  alt={restaurant.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  <Card.Text>{restaurant.cuisine}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(restaurant._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;
