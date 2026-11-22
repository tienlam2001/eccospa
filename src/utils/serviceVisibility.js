const hiddenServiceNames = new Set();

const serviceDisplayOverrides = {};

const getVisibleServices = (services) => services
  .filter((service) => !hiddenServiceNames.has(String(service?.name || '').trim().toLowerCase()))
  .map((service) => {
    const override = serviceDisplayOverrides[String(service?.name || '').trim().toLowerCase()];
    return override ? { ...service, ...override } : service;
  });

export { getVisibleServices };
