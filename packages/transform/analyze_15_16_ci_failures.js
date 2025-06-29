const fs = require('fs');

function analyze15To16CIFailures() {
  const logFile = '/home/ubuntu/full_outputs/gh_run_view_log_fail_1751134577.6148772.txt';
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    
    const lines = content.split('\n');
    const failures15to16 = [];
    let currentFailure = null;
    let isIn15to16 = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('FAIL __tests__/kitchen-sink/15-16/')) {
        isIn15to16 = true;
        if (currentFailure) {
          failures15to16.push(currentFailure);
        }
        currentFailure = {
          testFile: line.split('FAIL ')[1],
          errors: [],
          fullContext: []
        };
      } else if (line.includes('FAIL __tests__/kitchen-sink/') && !line.includes('15-16')) {
        isIn15to16 = false;
        if (currentFailure && isIn15to16) {
          failures15to16.push(currentFailure);
          currentFailure = null;
        }
      }
      
      if (isIn15to16 && currentFailure) {
        currentFailure.fullContext.push(line);
        
        if (line.includes('- Expected') || line.includes('+ Received') || 
            line.includes('ival') || line.includes('Integer')) {
          const errorContext = lines.slice(Math.max(0, i-3), i+7).join('\n');
          currentFailure.errors.push(errorContext);
        }
      }
    }
    
    if (currentFailure && isIn15to16) {
      failures15to16.push(currentFailure);
    }
    
    console.log('=== 15-16 CI FAILURE ANALYSIS ===');
    console.log(`Total 15-16 failures found: ${failures15to16.length}`);
    
    const errorPatterns = {
      'ival_empty_to_nested': 0,
      'integer_wrapping': 0,
      'negative_integer': 0,
      'missing_node_wrapping': 0
    };
    
    failures15to16.forEach(f => {
      f.errors.forEach(error => {
        if (error.includes('ival') && error.includes('{}') && error.includes('ival":')) {
          errorPatterns.ival_empty_to_nested++;
        }
        if (error.includes('Integer') && error.includes('+') && error.includes('-')) {
          errorPatterns.integer_wrapping++;
        }
        if (error.includes('-3') || error.includes('negative')) {
          errorPatterns.negative_integer++;
        }
        if (error.includes('+ ') && error.includes('Object {')) {
          errorPatterns.missing_node_wrapping++;
        }
      });
    });
    
    console.log('\n=== 15-16 ERROR PATTERNS ===');
    Object.entries(errorPatterns).forEach(([pattern, count]) => {
      console.log(`${pattern}: ${count} occurrences`);
    });
    
    console.log('\n=== DETAILED 15-16 FAILURES ===');
    failures15to16.slice(0, 3).forEach((f, i) => {
      console.log(`\n--- Failure ${i+1}: ${f.testFile} ---`);
      if (f.errors.length > 0) {
        console.log(f.errors[0].substring(0, 800));
      } else {
        console.log('No specific error patterns found, showing context:');
        console.log(f.fullContext.slice(-20).join('\n').substring(0, 800));
      }
      console.log('...\n');
    });
    
    console.log('\n=== COMPARISON WITH LOCAL FAILURES ===');
    console.log('CI shows 148 failures in 15-16 transformer');
    console.log('Local shows 74 failures in 15-16 transformer');
    console.log('Difference suggests CI may be testing additional scenarios or environment differences');
    
  } catch (error) {
    console.error('Error analyzing CI failures:', error.message);
  }
}

analyze15To16CIFailures();
