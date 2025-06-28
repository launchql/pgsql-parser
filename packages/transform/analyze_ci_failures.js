const fs = require('fs');

function analyzeCIFailures() {
  const logFile = '/home/ubuntu/full_outputs/gh_run_view_log_fail_1751134169.160914.txt';
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    
    const lines = content.split('\n');
    const failures = [];
    let currentFailure = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('FAIL __tests__/kitchen-sink/')) {
        const match = line.match(/FAIL __tests__\/kitchen-sink\/(\d+-\d+)\//);
        if (match) {
          if (currentFailure) {
            failures.push(currentFailure);
          }
          currentFailure = {
            transformer: match[1],
            testFile: line.split('FAIL ')[1],
            errors: []
          };
        }
      }
      
      if (currentFailure && (line.includes('- Expected') || line.includes('+ Received'))) {
        const errorContext = lines.slice(Math.max(0, i-5), i+10).join('\n');
        currentFailure.errors.push(errorContext);
      }
    }
    
    if (currentFailure) {
      failures.push(currentFailure);
    }
    
    console.log('=== CI FAILURE ANALYSIS ===');
    console.log(`Total failures found: ${failures.length}`);
    
    const transformerCounts = {};
    failures.forEach(f => {
      transformerCounts[f.transformer] = (transformerCounts[f.transformer] || 0) + 1;
    });
    
    console.log('\n=== FAILURES BY TRANSFORMER ===');
    Object.entries(transformerCounts).forEach(([transformer, count]) => {
      console.log(`${transformer}: ${count} failures`);
    });
    
    const errorPatterns = {
      'str_to_sval': 0,
      'missing_wrapping': 0,
      'ival_issues': 0
    };
    
    failures.forEach(f => {
      f.errors.forEach(error => {
        if (error.includes('"str":') && error.includes('"sval":')) {
          errorPatterns.str_to_sval++;
        }
        if (error.includes('+ ') && error.includes('Object {')) {
          errorPatterns.missing_wrapping++;
        }
        if (error.includes('ival')) {
          errorPatterns.ival_issues++;
        }
      });
    });
    
    console.log('\n=== ERROR PATTERNS ===');
    Object.entries(errorPatterns).forEach(([pattern, count]) => {
      console.log(`${pattern}: ${count} occurrences`);
    });
    
    const my_failures = failures.filter(f => f.transformer === '15-16').slice(0, 3);
    console.log('\n=== SAMPLE 15-16 FAILURES ===');
    my_failures.forEach((f, i) => {
      console.log(`\n--- Failure ${i+1}: ${f.testFile} ---`);
      if (f.errors.length > 0) {
        console.log(f.errors[0].substring(0, 500) + '...');
      }
    });
    
  } catch (error) {
    console.error('Error analyzing CI failures:', error.message);
  }
}

analyzeCIFailures();
