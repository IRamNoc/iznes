const path = require('path');

module.exports = {
    "extends": "tslint-config-airbnb",
    "rules": {
        "indent": [
            true,
            "space"
        ],
        "ter-indent": [
            true,
            4
        ],
        "import-blacklist": [
            true,
            "rxjs"
        ],
        "directive-selector": [
            true,
            "element",
            "app",
            "kebab-case"
        ],
        "max-line-length": [
            true,
            120
        ],
        "object-shorthand-properties-first": [
            false
        ]
    }
};
