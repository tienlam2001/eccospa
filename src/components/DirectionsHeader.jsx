const DirectionsHeader = () => {
  const address = '4300 W Lake Mary Blvd #1030, Lake Mary, FL 32746';
  const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="directions-header">
      <div className="container directions-inner">
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="directions-link">
          {address}
        </a>
        <span className="directions-sep" aria-hidden="true" />
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="directions-link">
          Get Directions
        </a>
        <span className="directions-sep" aria-hidden="true" />
        <a href="tel:+14073330904" className="directions-link">
          (407) 333-0904
        </a>
      </div>
    </div>
  );
};

export default DirectionsHeader;
