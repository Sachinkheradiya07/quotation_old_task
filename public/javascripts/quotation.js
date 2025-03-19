let productDetailIndex = 1;

function addProductDetail() {
  const container = document.getElementById("productDetailsContainer");
  const newProductDetail = document.createElement("div");
  newProductDetail.classList.add(
    "productDetail",
    "card",
    "p-3",
    "mb-3",
    "border-success"
  );
  newProductDetail.innerHTML = `
          <div class="row g-3">
            <div class="col-md-4">
              <div class="form-group">
                <label for="productDetailId" class="form-label fw-bold">Select Product:</label>
                <select id="productDetailId" name="productDetails[${productDetailIndex}][productDetailId]" class="form-select" required>
                  <% products.forEach(product => { %>
                    <option value="<%= product.id %>"><%= product.productName %></option>
                    <% product.Variants.forEach(variant => { %>
                      <option value="<%= variant.id %>"><%= product.productName %> - <%= variant.variantName %></option>
                    <% }) %>
                  <% }) %>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="variantId" class="form-label fw-bold">Variant:</label>
                <select id="variantId" name="productDetails[${productDetailIndex}][variantId]" class="form-select" required>
                  <% products.forEach(product => { %>
                    <% product.Variants.forEach(variant => { %>
                      <option value="<%= variant.id %>"><%= variant.variantName %></option>
                    <% }) %>
                  <% }) %>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="unit" class="form-label fw-bold">Unit:</label>
                <select id="unit" name="productDetails[${productDetailIndex}][unit]" class="form-select" required>
                  <option value="MT(KG)">MT(KG)</option>
                  <option value="LT(ML)">LT(ML)</option>
                  <option value="TON">TON</option>
                  <option value="Pieces">Pieces</option>
                  <option value="KG(KG)">KG(KG)</option>
                  <option value="BOTTLES(KG)">BOTTLES(KG)</option>
                  <option value="JAR(GM)">JAR(GM)</option>
                  <option value="CAN(KG)">CAN(KG)</option>
                  <option value="BOX(GM)">BOX(GM)</option>
                  <option value="PCS(KG)">PCS(KG)</option>
                  <option value="BAGS(KG)">BAGS(KG)</option>
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="quantity" class="form-label fw-bold">Quantity:</label>
                <input type="number" step="0.01" id="quantity" name="productDetails[${productDetailIndex}][quantity]" class="form-control" required oninput="calculateTotalPrice(this)">
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="price" class="form-label fw-bold">Price:</label>
                <input type="number" step="0.01" id="price" name="productDetails[${productDetailIndex}][price]" class="form-control" required oninput="calculateTotalPrice(this)">
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="totalPrice" class="form-label fw-bold">Total Price:</label>
                <input type="number" step="0.01" id="totalPrice" name="productDetails[${productDetailIndex}][totalPrice]" class="form-control bg-light" required readonly>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="selectPackage" class="form-label fw-bold">Select Package:</label>
                <select id="selectPackage" name="productDetails[${productDetailIndex}][packageId]" class="form-select" required onchange="updatePackageDetails(this)">
                  <% packages.forEach(package => { %>
                    <option value="<%= package.id %>" data-net-weight="<%= package.netWeight %>" data-gross-weight="<%= package.grossWeight %>"><%= package.unit %> - <%= package.netWeight %> - <%= package.grossWeight %></option>
                  <% }) %>
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="netWeight" class="form-label fw-bold">Net Weight:</label>
                <input type="number" step="0.01" id="netWeight" name="productDetails[${productDetailIndex}][netWeight]" class="form-control bg-light" required readonly>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="grossWeight" class="form-label fw-bold">Gross Weight:</label>
                <input type="number" step="0.01" id="grossWeight" name="productDetails[${productDetailIndex}][grossWeight]" class="form-control bg-light" required readonly>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="totalPackages" class="form-label fw-bold">Total Packages:</label>
                <input type="number" id="totalPackages" name="productDetails[${productDetailIndex}][totalPackages]" class="form-control bg-light" required readonly>
              </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button type="button" class="btn btn-outline-danger remove-btn w-100" onclick="removeProductDetail(this)">Remove</button>
            </div>
          </div>
        `;
  container.appendChild(newProductDetail);
  productDetailIndex++;
}

function removeProductDetail(button) {
  const productDetail = button.parentElement.parentElement.parentElement;
  productDetail.remove();
  updateTotalWeightsAndPackages();
}

function fillConsigneeDetails() {
  const consigneeSelect = document.getElementById("consigneeName");
  const selectedOption = consigneeSelect.options[consigneeSelect.selectedIndex];
  const address = selectedOption.getAttribute("data-address");
  const countryId = selectedOption.getAttribute("data-country-id");
  document.getElementById("consigneeAddress").value = address;
  document.getElementById("countryId").value = countryId;
}

function calculateTotalPrice(element) {
  const productDetail = element.closest(".productDetail");
  const quantity = productDetail.querySelector('[name*="[quantity]"]').value;
  const price = productDetail.querySelector('[name*="[price]"]').value;
  const totalPrice = productDetail.querySelector('[name*="[totalPrice]"]');
  totalPrice.value = (quantity * price).toFixed(2);
  updatePackageDetails(productDetail.querySelector('[name*="[packageId]"]'));
}

function updatePackageDetails(selectElement) {
  const productDetail = selectElement.closest(".productDetail");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const netWeightPerPackage = parseFloat(
    selectedOption.getAttribute("data-net-weight")
  );
  const grossWeightPerPackage = parseFloat(
    selectedOption.getAttribute("data-gross-weight")
  );
  const quantity = parseFloat(
    productDetail.querySelector('[name*="[quantity]"]').value
  );

  const totalNetWeight = productDetail.querySelector('[name*="[netWeight]"]');
  const totalGrossWeight = productDetail.querySelector(
    '[name*="[grossWeight]"]'
  );
  const totalPackages = productDetail.querySelector(
    '[name*="[totalPackages]"]'
  );

  totalNetWeight.value = (netWeightPerPackage * quantity).toFixed(2);
  totalGrossWeight.value = (grossWeightPerPackage * quantity).toFixed(2);
  totalPackages.value = quantity;

  updateTotalWeightsAndPackages();
}

function updateTotalWeightsAndPackages() {
  let totalNetWeight = 0;
  let totalGrossWeight = 0;
  let grandTotal = 0;

  document.querySelectorAll(".productDetail").forEach((productDetail) => {
    totalNetWeight +=
      parseFloat(productDetail.querySelector('[name*="[netWeight]"]').value) ||
      0;
    totalGrossWeight +=
      parseFloat(
        productDetail.querySelector('[name*="[grossWeight]"]').value
      ) || 0;
    grandTotal +=
      parseFloat(productDetail.querySelector('[name*="[totalPrice]"]').value) ||
      0;
  });

  document.getElementById("totalNetWeight").value = totalNetWeight.toFixed(2);
  document.getElementById("totalGrossWeight").value =
    totalGrossWeight.toFixed(2);
  document.getElementById("grandTotal").value = grandTotal.toFixed(2);
}
