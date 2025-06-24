import { transform13To14 } from './index';
import * as PG13Types from './13/types';

function testBasicTransformation() {
  const pg13Integer: PG13Types.Node = {
    Integer: { ival: 42 }
  };
  
  try {
    const pg14Result = transform13To14(pg13Integer);
    console.log('✓ Integer transformation successful:', JSON.stringify(pg14Result, null, 2));
  } catch (error) {
    console.error('✗ Integer transformation failed:', error);
  }

  const pg13String: PG13Types.Node = {
    String: { sval: 'hello' }
  };
  
  try {
    const pg14Result = transform13To14(pg13String);
    console.log('✓ String transformation successful:', JSON.stringify(pg14Result, null, 2));
  } catch (error) {
    console.error('✗ String transformation failed:', error);
  }

  const pg13AConst: PG13Types.Node = {
    A_Const: {
      ival: { ival: 1 },
      location: 7
    }
  };
  
  try {
    const pg14Result = transform13To14(pg13AConst);
    console.log('✓ A_Const transformation successful:', JSON.stringify(pg14Result, null, 2));
  } catch (error) {
    console.error('✗ A_Const transformation failed:', error);
  }
}

if (require.main === module) {
  testBasicTransformation();
}
