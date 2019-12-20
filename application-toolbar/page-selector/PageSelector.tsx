import React, { useEffect, useCallback, useState } from 'react';
import ipushpull from "ipushpull-js";
import { useSelector } from 'react-redux';

import { IPage, IUserPageAccess } from 'ipushpull-js/dist/Page/Page';
import Dropdown, { DropdownOption } from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/Dropdown';
import Button from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/SimpleButton';
import Sync from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/icons/arrow-right';
import Stop from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/icons/check-box-outline';
import Save from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/icons/save';

import mockCells from './mockCells.json';
import mockLiveA from './mockLiveA.json';
import mockLiveB from './mockLiveB.json';
import './PageSelector.css';

interface IDomainPage {
    id: number;
    url: string;
    name: string;
    display_name: string;
    current_user_domain_page_access: IPage;
};

// Think this might be how we get the selected cells from agGrid
//const cells = api.gridApi.getSelectedCellInfo();

const ABDropdown = (Dropdown as any);
const ABButton = (Button as any);

const exportTypes = ["All Data", "Visible Data", "Selected Cells", "Selected Rows"];

// ipushpull.pushData(selectedPage, [['mock report', 'hello world']]);

// ipushpull.pushData(selectedPage, this.blotterApi.reportService.generateArrayFromReport({ name: 'selected cells' }));
// or
// ipushpull.pushData(selectedPage, this.blotterApi.reportService.gerneatedArrayFromReport(this.blotterApi.store.Export.Report));

// PushPullService.js:180
// page = ipushpull.loadPage('whatever')
// page.content.update
// page.push

export const getGridData = (columns :any, rows: any) => {
    return { columns, rows };
}

const PageSelector = () => {
    const [domainsAndPages, setDomainsAndPages] = useState<IDomainPage[]>([]);
    const [domains, setDomains] = useState<DropdownOption[]>([]);
    const [pages, setPages] = useState<DropdownOption[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);
    const [exportType, setExportType] = useState<string>('');
    const [sync, setSync] = useState<boolean>(false);

    const [liveData, setLiveData] = useState(mockLiveA);

    const selected = useSelector(state => state.gridData);
    console.log(selected);

    const getDomainsAndPages = useCallback(() => ipushpull.api.getDomainsAndPages(process.env.IPUSHPULL_API_KEY as string)
        .then(result => {
            setDomainsAndPages(result.data.domains);
            setDomains(result.data.domains.map((domain: IDomainPage) => ({ label: domain.name, value: domain.id })));
        }), [setDomainsAndPages, domainsAndPages]
    );

    const getPages = useCallback((id) => {
        setSelectedDomain(id);
        const selectedPages = domainsAndPages.find(x => x.id === id);
        
        if (selectedPages) {
            setPages(selectedPages.current_user_domain_page_access.pages.map((page: IUserPageAccess) => ({ label: page.name, value: page.id })));
        }
    }, [domainsAndPages, setSelectedDomain]);

    const sendSnapshot = useCallback(updatedData => ipushpull.api.getPage({ domainId: selectedDomain, pageId: selectedPage })
            .then(page => {
                let data = {
                    ...page.data,
                    content: updatedData, //This will need to pull the actual selected data, currently a mockedArray
                };
                let requestData = {
                    domainId: selectedDomain,
                    pageId: selectedPage,
                    data
                };
                ipushpull.api.savePageContent(requestData)
                    .then(res => console.log('res: ', res)) // This returns push_interval and pull_interval
            }),
        [selectedDomain, selectedPage]
    );

    const toggleSync = useCallback(() => setSync(!sync), [sync]);

    useEffect(() => {
        if (!domainsAndPages.length) {
            getDomainsAndPages();
        }
        if (sync) {
            setTimeout(() => {
                if (liveData === mockLiveA) {
                    setLiveData(mockLiveB);
                } else {
                    setLiveData(mockLiveA);
                }
            }, 2000);
            sendSnapshot(liveData);
        }
    }, [liveData, sync, selectedDomain, selectedPage]);

    return (
        <div className="selectorWrapper">
            <ABDropdown options={domains} placeholder="Select file" onChange={(id : number) => getPages(id)}/>
            <ABDropdown options={pages} placeholder="Select page" onChange={(id: number) => setSelectedPage(id)} disabled={!selectedDomain} />
            <ABDropdown options={exportTypes} placeholder="Select report" onChange={(type: string) => setExportType(type)} />
            <ABButton onClick={() => sendSnapshot(mockCells)} disabled={!(selectedDomain && selectedPage)}>
                <Save />
            </ABButton>
            <ABButton tone={sync ? 'error' : 'success'} disabled={!(selectedDomain && selectedPage)} onClick={toggleSync}>
                {sync ? <Stop /> : <Sync />}
            </ABButton>
        </div>
    );
};

export default PageSelector;
