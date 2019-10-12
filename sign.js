exports.default = async function(configuration) {
  const cert = configuration.cscInfo.file;
  const pass = configuration.cscInfo.password;

  require('child_process').execSync(
    `osslsigncode sign -pkcs12 ${cert.replace(' ', '\\ ')} -pass ${pass} -n ${
      configuration.name
    } -i ${configuration.site} -in ${configuration.path} -out ${
      configuration.path
    }`,
    {
      stdio: 'inherit'
    }
  );
};
