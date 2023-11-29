/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { StyledButton, Frame } from 'react95';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import { createItem, updateItem } from '../../api/itemData';

const initialState = {
  name: '',
  brand: '',
  imageUrl: '',
  isTop: false,
};

export default function ItemForm({ itemObj }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState({ ...initialState, uid: user.uid });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setFormInput(initialState);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (itemObj.firebaseKey) setFormInput(itemObj);
  }, [itemObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itemObj.firebaseKey) {
      updateItem(formInput).then(() => {
        handleShow();
      });
    } else {
      const payload = { ...formInput, uid: user.uid };
      createItem(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateItem(patchPayload).then(() => {
          handleShow();
        });
      });
    }
  };

  return (
    <>
      <Frame>
        <Form id="add" onSubmit={handleSubmit}>
          <h1>{itemObj.firebaseKey ? 'UPDATE' : 'ADD'} PIECE</h1>
          <div id="row">
            <div>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="enter image URL"
                  name="imageUrl"
                  value={formInput.imageUrl}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  className="mb-3"
                  type="switch"
                  id="top"
                  name="top"
                  label="top?"
                  checked={formInput.isTop}
                  onChange={(e) => {
                    setFormInput((prevState) => ({
                      ...prevState,
                      isTop: e.target.checked,
                    }));
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>BRAND</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formInput.brand}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>DESCRIPTION</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  name="name"
                  placeholder="e.g. Long Sleeve Crew Neck Sweater"
                  value={formInput.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <img style={{ maxHeight: '200px', marginLeft: '20px' }} src={formInput.imageUrl} alt={formInput.name} />
          </div>
          <Button className="save" type="submit">{itemObj.firebaseKey ? 'Update' : 'Create'} Piece
          </Button>

        </Form>
      </Frame>

      <Modal show={show} onHide={handleClose}>
        <Frame>
          <Modal.Header closeButton>
            <Modal.Title>TOTALLY BITCHIN!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="row">
              <div>You {itemObj.firebaseKey ? 'updated' : 'added'} a piece {itemObj.firebaseKey ? 'in' : 'to'} your wardrobe!</div>
              <img id="pen" className="rock" src="/assets/pen.png" alt="fluffy pen animation" style={{ height: '70px' }} />
            </div>
            <div className="btn-grp">
              {itemObj.firebaseKey
                ? (
                  <Link passHref href="/items">
                    <StyledButton primary className="m-2">
                      EDIT ANOTHER
                    </StyledButton>
                  </Link>
                )
                : (
                  <StyledButton primary className="m-2" onClick={handleClose}>
                    ADD ANOTHER
                  </StyledButton>
                )}
              <Link passHref href="/">
                <StyledButton primary className="black m-2">
                  MAKE OUTFITS
                </StyledButton>
              </Link>
            </div>
          </Modal.Body>
        </Frame>
      </Modal>
    </>
  );
}

ItemForm.propTypes = {
  itemObj: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    firebaseKey: PropTypes.string,
    brand: PropTypes.string,
  }),
};

ItemForm.defaultProps = {
  itemObj: initialState,
};
