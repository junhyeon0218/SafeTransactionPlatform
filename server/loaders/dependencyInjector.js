const { Container } = require("typedi");
const dependencyConvert = require("./dependencyConvert");

/** typedi Container에 의존성들을 주입하는 함수
 * @description Container.get으로 불러오기 전에 실행되어야 함
 * @param {Object.<Class>} container - 컨테이너 객체
 * @param {Object.<Class>} container.models - 사용할 모델 클래스들의 객체.
 * @param {Object} container.services - 사용할 서비스 클래스들 객체.
 * @return {void} 의존성 주입
 */
module.exports = ({ models, services }) => {
  const { modelsArr, servicesArr } = dependencyConvert(models, services);

  try {
    modelsArr.forEach((m) => {
      // console.log(m);
      Container.set({ id: m.name, factory: () => m.model });
      // console.log(`👌 ${m.name} injected into container`);
    });

    servicesArr.forEach((s) => {
      // console.log(s);
      Container.set({ id: s.name, factory: () => new s.service() });
      // console.log(`👌 ${s.name} injected into container`);
    });
  } catch (err) {
    console.log(`🔥 Error on Dependency Injector loader: `);
    throw err;
  }
};
