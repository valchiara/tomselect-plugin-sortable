import TomSelect from 'tom-select';
import Sortable from 'sortablejs';

interface PluginOptions {
    [key: string]: any;
}

interface SortablePluginOptions {
    sortableOptions: Sortable.Options; 
}

const defaultSortableOptions: PluginOptions = {
    draggable: '[data-value]',
}

TomSelect.define('sortable', function (options) {
    const sortableOptions = {...defaultSortableOptions, ...options};
    if (this.settings.mode !== 'multi') {
        return;
    }

    const initSortable = () => {
        this.sortable = new Sortable(this.control, {
            draggable: sortableOptions.draggable,
            filter: 'input',
            animation: 150,
            direction: 'horizontal',
            onEnd: () => {
                const values = Array.from<HTMLElement>(this.control.querySelectorAll(sortableOptions.draggable)).map(
                    item => item.dataset.value,
                );
                this.setValue(values);
            },
        });
    }

    if(this.isSetup) {
        initSortable();
    } else {
        this.hook('after', 'setup', () => {
            initSortable();
        });
    }

    this.hook('after', 'render', () => {
        if (!this.control) {
            return;
        }
        for (const item of this.control.querySelectorAll(sortableOptions.draggable)) {
            item.addEventListener('mousedown', e => {
                e.stopPropagation();
            });
        }
    });
});
