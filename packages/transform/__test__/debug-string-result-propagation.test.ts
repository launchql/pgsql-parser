import { Parser } from '@pgsql/parser';
import { V14ToV15Transformer } from '../src/transformers/v14-to-v15';

class DetailedStringTransformer extends V14ToV15Transformer {
  String(nodeData: any, context?: any): any {
    console.log(`=== String method called ===`);
    console.log('Input nodeData:', JSON.stringify(nodeData, null, 2));
    
    const result = super.String(nodeData, context);
    
    console.log('String method returning:', JSON.stringify(result, null, 2));
    return result;
  }

  transform(node: any, context?: any): any {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const keys = Object.keys(node);
      if (keys.length === 1) {
        const nodeType = keys[0];
        const nodeData = node[nodeType];
        
        if (nodeType === 'String') {
          console.log(`=== BaseTransformer processing String node ===`);
          console.log('Input node:', JSON.stringify(node, null, 2));
          
          if (nodeData && typeof nodeData === 'object' && !Array.isArray(nodeData)) {
            const methodName = nodeType;
            
            if (typeof (this as any)[methodName] === 'function') {
              console.log('=== Calling String method via dynamic dispatch ===');
              const transformedData = (this as any)[methodName](nodeData, context);
              console.log('Method returned:', JSON.stringify(transformedData, null, 2));
              const wrappedResult = { [nodeType]: transformedData };
              console.log('Wrapped result:', JSON.stringify(wrappedResult, null, 2));
              return wrappedResult;
            }
          }
        }
      }
    }
    
    return super.transform(node, context);
  }
}

describe('Debug String Result Propagation', () => {
  it('should trace exactly where String transformation gets lost', async () => {
    const stringNode = {
      String: {
        str: "test_value"
      }
    };
    
    console.log('=== Testing String Result Propagation ===');
    console.log('Input String node:', JSON.stringify(stringNode, null, 2));
    
    const transformer = new DetailedStringTransformer();
    const result = transformer.transform(stringNode);
    
    console.log('\n=== Final Result ===');
    console.log('Final result:', JSON.stringify(result, null, 2));
    
    expect(result.String.sval).toBe("test_value");
    expect(result.String.str).toBeUndefined();
  });
});
