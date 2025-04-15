import React from 'react';

const Alert = (props) => {
  const capti = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    props.alerte && (
      <div className={`alert alert-${props.alerte.type} alert-dismissible fade show`} role="alert">
        <strong>{capti(props.alerte.type)}: </strong> {props.alerte.msg}
      </div>
    )
  );
};

export default Alert;
