const { Container } = require("typedi");
const Authentication = require("../utils/authentication");
module.exports = ({ models, services }) => {
  try {
    models.forEach((m) => {
      console.log(m);
      Container.set({ id: m.name, factory: () => m.model });
      console.log(`👌 ${m.name} injected into container`);
    });

    Container.set({ id: "jwtAuth", factory: () => Authentication });
    console.log(`👌 jwtAuth injected into container`);

    services.forEach((s) => {
      console.log(s);
      Container.set({ id: s.name, factory: () => new s.service() });
      console.log(`👌 ${s.name} injected into container`);
    });
  } catch (err) {
    console.log(`🔥 Error on Dependency Injector loader: `);
    throw err;
  }
};
