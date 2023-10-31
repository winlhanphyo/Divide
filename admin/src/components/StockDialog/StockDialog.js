import React from 'react';
import swal from 'sweetalert';
import axios from '../../axios/index';

const ConfirmDialog = (props) => {
  const [count, setCount] = React.useState(0);
  const [errorCount, setErrorCount] = React.useState(null);

  /**
    * handle textbox change.
    */
  const handleChange = (event) => {
    const value = event.target.value;
    setCount(value);
    if (value && errorCount) {
      setErrorCount(null);
    }
  };

  const validation = () => {
    let validate =  true;
    if (Number(count) > 0) {
      setErrorCount(null);
    } else {
      setErrorCount("Count is required");
      validate = false;
    }
    return validate;
  }

  const handleClick = (e) => {
    e.preventDefault();
    const validate = validation();
    console.log('validate', validate);
    if (validate) {
      let id = props.productData.id
      // setLoading(true);
      const user = JSON.parse(localStorage.getItem("admin"));
      let formParam = new FormData();
      // formParam.append('name', props.productData.name);
      // formParam.append('description', props.productData.description);
      let param = Number(props.productData.count) + Number(count); 
      formParam.append('count', param);
      formParam.append('updated_user_id', user.id);
      axios.post(`/v1/product/${id}`, formParam,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((dist) => {
          console.log("Updated Product")
          // setLoading(false);
          swal("Success", "Product stock is updated successfully", "success").then(() => {
            window.location.href = "/admin/product";
          });
        }).catch((err) => {
          swal("Oops!", "Update Product API Error", "error");
          // setLoading(false);
        })
    }
    // props.next();
  }


  return (
    <div class="modal fade" id="stockModal" tabIndex="-1" role="dialog" aria-labelledby="stockModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Add Stock</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form class="forms-sample">
            <div class="modal-body">
              <div class="form-group">
                <label for="count">Count</label>
                <input type="number" name="count" className={count ? `form-control` : `form-control is-invalid`} value={count} onChange={handleChange} id="count" placeholder="Count" />
                {errorCount ? (
                  <div class="invalid-feedback">{errorCount}</div>) : ''}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onClick={handleClick} data-dismiss="modal">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog;