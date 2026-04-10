import AnalyticsDashboard from './AnalyticsDashboard';
import RestauranteApp from './RestauranteApp';
import WellnessApp from './WellnessApp';
import InventarioApp from './InventarioApp';

// ... existing code 

renderAppSheet(app) {
    switch (app.id) {
        case 'restaurant':
            return <RestauranteApp />;
        case 'wellness':
            return <WellnessApp />;
        case 'inventory':
            return <InventarioApp />;
        // default case...
        default:
            return <ResourceManager />;
    }
}
// ... remaining code
