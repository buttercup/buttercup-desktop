import {
  Vault as VaultBase,
  Entry,
  FIELD_VALUE_TYPE_OTP,
  createVaultFacade,
} from 'buttercup/web';
import type Vault from 'core/Vault';

export const createArchive = (): Vault => {
  const vault = VaultBase.createWithDefaults();
  const [general] = vault.findGroupsByTitle('General');
  general
    .createEntry('Home wi-fi')
    .setProperty('username', 'somehow')
    .setProperty('password', 'idsfio49v-1')
    .setProperty('password', 'h78.dI2m;110')
    .setProperty('password', '[5LC-j_"C7b;"nbn')
    .setProperty('password', '8rE7=Xkm<z5~b/[Q')
    .setProperty('password', 'ReGKd4H5?D5;=y~D')
    .setProperty('password', 'f>ZSh-,!Ly7Hrd&:Cv^@~,d')
    .setProperty('password', '7#eELw%GS^)/"')
    .setProperty('password', 'K3"J8JSKHk|5hwks_^')
    .setProperty('password', 'x8v@mId01')
    .setProperty('url', 'https://google.com');
  general
    .createEntry('Social')
    .setProperty('title', 'Social website')
    .setProperty('username', 'user@test.com')
    .setProperty('password', 'vdfs867sd5')
    .setProperty(
      'otpURI',
      'otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30'
    )
    .setProperty(
      'otpURL',
      'otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30'
    )
    .setAttribute(
      `${Entry.Attributes.FieldTypePrefix}otpURI`,
      FIELD_VALUE_TYPE_OTP
    )
    .setProperty('url', 'https://site.com/setup/create-account.php?token=123')
    .setProperty('url', 'https://site.com/login.php')
    .setProperty('url', 'https://site.com')
    .setProperty('Recovery pin', '1234');
  general
    .createEntry('Gate lock combination')
    .setProperty('username', 'test')
    .setProperty('password', '4812')
    .setProperty('password', 'passw0rd');
  const notes = vault.createGroup('Notes');
  notes
    .createEntry('Meeting notes 2019-02-01')
    .setAttribute(Entry.Attributes.FacadeType, 'note')
    .setProperty(
      'note',
      'Team meeting\n\n - Cool item created\n   - To be released sometime\n   - Costs $$$\n - Bug found, oh noes\n   - Fire Tim\n   - Bye Tim!\n - Success ✌️\n\nAll done.\n'
    );
  notes.createGroup('Meetings');
  const personal = notes.createGroup('Personal');
  personal.createGroup('Test');
  return vault;
};

export function createArchiveFacade(vault: any) {
  return JSON.parse(JSON.stringify(createVaultFacade(vault)));
}
