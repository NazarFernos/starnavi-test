import React from "react";
import Square from "../Square/Square";
import "./Field.css";


const Field = props => {
  const { field, fieldSquares } = props;

  return (
    <div className="Field">
      {field && (
        <ul className="grid">
          {fieldSquares.map(square => (
            <Square
              key={square.id}
              onClick={() => props.onClickSquare(square.id)}
              {...square}
              field={field}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Field;
