/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  async function main(vars, res) {
    // const pass = await global.AppImport('.util').encrypt(vars.params.body.password);
    const payload = { joined: (new Date()).getTime() };
    await GLOBAL_APP_CONFIG.$store.write('user', vars.params.body.username, payload);
    return payload;
  }

  function func(vars, methods, req, res, next) {
    main.then(next).catch(next.bind(res, 500));
  }

  return func;
};
