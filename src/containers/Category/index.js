import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, getAllCategory, updateCategories, deleteCategories as deleteCategoriesAction } from '../../actions';
import { Layout } from '../../components/Layout';
import { NewModal } from '../../components/UI/Modal';
import CheckboxTree from 'react-checkbox-tree';
import {
  IoIosCheckboxOutline, IoIosCheckbox, IoIosArrowDown, IoIosArrowForward,IoIosAdd, IoIosTrash, IoIosCloudUpload
} from 'react-icons/io'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import UpdateCategoriesModal from './components/UpdateCategoriesModal';
import AddCategoryModel from './components/AddCategoryModal';
import './style.css';
/**
* @author
* @function Category
**/
export const Category = (props) => {
  const category = useSelector(state => state.category);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [updateCategoryModel, setUpdateCategoryModel] = useState(false);
  const [deleteCategoryModel, setDeleteCategoryModel] = useState(false);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!category.loading){
      setShow(false);
    }
  },[category.loading]);
  const handleClose = () => {
    const form = new FormData();
    if (categoryName === "") {
      alert("Name is required");
      setShow(false);
      return;
    }
    form.append('name', categoryName);
    form.append('parentId', parentCategoryId);
    form.append('categoryImage', categoryImage);
    dispatch(addCategory(form));
    setShow(false);
  }
  const handleShow = () => setShow(true);
  const renderCategories = (categories) => {
    let _categories = [];
    for (let category of categories) {
      _categories.push(
        {
          label: category.name,
          value: category._id,
          children: category.children.length > 0 && renderCategories(category.children)
        }
      );
    }
    return _categories;
  }
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ 
        value: category._id,
        name: category.name, 
        parentId: category.parentId, 
        type:category.type 
      });
      if (category.children.length > 0) {
        createCategoryList(category.children, options)
      }
    }
    return options;
  }
  const handleCategoryImage = (e) => {
    setCategoryImage(e.target.files[0]);
  }
  const updateCategory = () => {
    updateCheckedAndExpandedCategories();
    setUpdateCategoryModel(true);
  }
  const updateCheckedAndExpandedCategories = () => {
    const categories = createCategoryList(category.categories);
    const checkedArray = [];
    const expandedArray = [];
    checked.length > 0 && checked.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && checkedArray.push(category);
    })
    expanded.length > 0 && expanded.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && expandedArray.push(category);
    })
    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  }
  const handleCategoryInput = (key, value, index, type) => {
    if (type == "checked") {
      const updatedCheckedArray = checkedArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
      setCheckedArray(updatedCheckedArray);
    } else if (type == "expanded") {
      const updatedExpandedArray = expandedArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
      setExpandedArray(updatedExpandedArray);
    }
  }
  const updateCategoriesForm = () => {
    const form = new FormData();
    expandedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : "");
      form.append('type', item.type);
    });
    checkedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : "");
      form.append('type', item.type);
    });
    dispatch(updateCategories(form));
  }
  const deleteCategory = () => {
    updateCheckedAndExpandedCategories();
    setDeleteCategoryModel(true);
  }
  const deleteCategories = () => {
    const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
    const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
    const idsArray = expandedIdsArray.concat(checkedIdsArray);
    if (checkedIdsArray.length > 0) {
      dispatch(deleteCategoriesAction(checkedIdsArray)).then(result => {
        if (result) {
          dispatch(getAllCategory());
          setDeleteCategoryModel(false);
        }
      });
    }
    setDeleteCategoryModel(false);
  }
  const renderDeleteCategoryModel = () => {
    return (
      <NewModal
        modalTitle="Confirm To Delete?"
        show={deleteCategoryModel}
        handleClose={() => setDeleteCategoryModel(false)}
        buttons={[
          {
            label: 'No',
            color: 'primary'
          },
          {
            label: 'Yes',
            color: 'danger',
            onClick: deleteCategories
          }
        ]}
      >
        <h5>Expanded</h5>
        {expandedArray.map((item, index) => <span key={index}>{item.name}</span>)}
        <h5>Checked</h5>
        {checkedArray.map((item, index) => <span key={index}>{item.name}</span>)}
      </NewModal>
    );
  }
  const categoryList = createCategoryList(category.categories);
  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Category</h3>
              <div className="actionBtnContainer">
                <span>Actions</span>
                <button onClick={handleShow}><IoIosAdd/><span>Add</span></button>
                <button onClick={deleteCategory}><IoIosTrash/><span>Delete</span></button>
                <button onClick={updateCategory}><IoIosCloudUpload/><span>Edit</span></button></div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CheckboxTree
              nodes={renderCategories(category.categories)}
              checked={checked}
              expanded={expanded}
              onCheck={checked => setChecked(checked)}
              onExpand={expanded => setExpanded(expanded)}
              icons={{
                check: <IoIosCheckbox />,
                uncheck: <IoIosCheckboxOutline />,
                halfCheck: <IoIosCheckboxOutline />,
                expandClose: <IoIosArrowForward />,
                expandOpen: <IoIosArrowDown />
              }}
            />
          </Col>
        </Row>
      </Container>
      <AddCategoryModel
        show={show}
        handleClose={()=>setShow(false)}
        onSubmit={handleClose}
        modalTitle={'Add New Category'}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        parentCategoryId={parentCategoryId}
        setParentCategoryId={setParentCategoryId}
        categoryList={categoryList}
        handleCategoryImage={handleCategoryImage}
      />
      <UpdateCategoriesModal
        show={updateCategoryModel}
        handleClose={()=>
          setUpdateCategoryModel(false)}
        onSubmit={updateCategoriesForm}
        modalTitle={'Update Categories'}
        size="lg"
        expandedArray={expandedArray}
        checkedArray={checkedArray}
        handleCategoryInput={handleCategoryInput}
        categoryList={categoryList}
      />
      {renderDeleteCategoryModel()}
    </Layout>
  )
}