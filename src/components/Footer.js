import React from "react";
import "./css/Footer.css";
function Footer() {
  return (
    <div className="footer">
      <div className="footer-upper">
        <p>
          To inspire powerful conversations and collaborations among members
          worldwide so together we can change the world with creativity.
        </p>
        <div className="footer-upper-links">
          <i class="fa-brands fa-facebook-square"></i>
          <i class="fa-brands fa-instagram-square"></i>
          <i class="fa-brands fa-github-square"></i>
          <i class="fa-solid fa-square-envelope"></i>
        </div>
      </div>
      <div className="footer-under">Copyright © All rights reserved</div>
    </div>
  );
}

export default Footer;
