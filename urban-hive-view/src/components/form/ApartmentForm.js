import formStyles from "./Form.module.css";
import { useState } from "react";
import Input from "./Input";
function ApartmentForm({ handleSubmit, apartmentData, btnText }) {
  const [apartment, setApartment] = useState(apartmentData || {});
  const [preview, setPreview] = useState([]);

  function onFileChange(e) {
    setPreview(Array.from(e.target.files));
    setApartment({ ...apartment, images: [...e.target.files] });
  }
  function handleChange(e) {
    setApartment({ ...apartment, [e.target.name]: e.target.value });
  }
  function submit(e) {
    e.preventDefault();
    handleSubmit(apartment);
  }

  return (
    <form onSubmit={submit} className={formStyles.form_container}>
      <div className={formStyles.previer_apartment_images}>
        {preview.length > 0
          ? preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={apartment.location}
                key={`${apartment.location}+${index}`}
              ></img>
            ))
          : apartment.images &&
            apartment.images.map((image, index) => (
              <img
                src={`http://localhost:5000/images/apartments/${image}`}
                alt={apartment.location}
                key={`${apartment.location}+${index}`}
              ></img>
            ))}
      </div>
      <Input
        text="Imagens do apartamento"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="Localização"
        type="text"
        name="location"
        placeholder="Digite a localização"
        handleOnChange={handleChange}
        value={apartment.location}
      />
      <Input
        text="Valor"
        type="number"
        name="price"
        placeholder="Digite o valor em R$"
        handleOnChange={handleChange}
      />
      <Input
        text="Contato"
        type="text"
        name="contact"
        placeholder="Digite o contato para comunicação"
        handleOnChange={handleChange}
      />
      <Input
        text="Descrição"
        type="text"
        name="description"
        placeholder="Digite a descrição"
        handleOnChange={handleChange}
      />
      <input type="submit" value={btnText}></input>
    </form>
  );
}

export default ApartmentForm;
