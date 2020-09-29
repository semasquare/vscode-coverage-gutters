import * as assert from "assert";
import {CoverageFile, CoverageType} from "../../src/files/coveragefile";

suite("Coverage File Tests", function() {
    test("Returns the correct file type for a file @unit", function() {
        const fakeLcovInfo = `
            TN:
            SF:./semasquare/dev/vscode-coverage-gutters/example/node/test.js
            FN:6,(anonymous_1)
            FN:7,(anonymous_2)
            FN:12,(anonymous_3)
            FN:17,(anonymous_4)
            FN:22,(anonymous_5)
            FN:27,(anonymous_6)
            FN:32,(anonymous_7)
            FNF:7
            FNH:7
        `;
        const coverageFile = new CoverageFile(fakeLcovInfo);
        assert.equal(coverageFile.type, CoverageType.LCOV);
    });

    test("Ignores empty file (#150) @unit", function() {
        const coverageFile = new CoverageFile("");
        assert.equal(coverageFile.type, CoverageType.NONE);
    });
});
